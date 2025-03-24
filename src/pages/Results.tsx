
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, Circle, FileDown, ArrowRight, AlertCircle } from "lucide-react";
import { TestResult, cognitiveTests } from "@/data/cognitiveTestsData";
import { getTestResults } from "@/utils/testUtils";
import { getTestResults as getServerTestResults, getUserProfile } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { checklistItems, checklistCategories, ageGroups } from "@/data/checklistData";

const Results = () => {
  const [checklistResults, setChecklistResults] = useState<any>(null);
  const [cognitiveTestResults, setCognitiveTestResults] = useState<TestResult[]>([]);
  const [handwritingResults, setHandwritingResults] = useState<any>(null);
  const [serverResults, setServerResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const [hasCompletedAnyTest, setHasCompletedAnyTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Function to load all data
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Try to get user profile
        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            const profile = await getUserProfile(userId);
            setUserProfile(profile);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
        
        // Load checklist results from localStorage
        const savedChecklistResults = localStorage.getItem("checklistResults");
        if (savedChecklistResults) {
          setChecklistResults(JSON.parse(savedChecklistResults));
        }
        
        // Load handwriting analysis results if available
        const savedHandwritingResults = localStorage.getItem("handwritingResults");
        if (savedHandwritingResults) {
          setHandwritingResults(JSON.parse(savedHandwritingResults));
        }
        
        // Load cognitive test results from localStorage
        const localTestResults = getTestResults();
        if (localTestResults && localTestResults.length > 0) {
          setCognitiveTestResults(localTestResults);
        }
        
        // Try to load results from server if user is logged in
        if (userId) {
          try {
            const results = await getServerTestResults(userId);
            setServerResults(results);
            
            // Merge results if needed - server results take precedence
            if (results && results.length > 0) {
              // Create a map of test IDs to their most recent result
              const resultMap = new Map();
              
              // First add local results
              localTestResults.forEach(result => {
                resultMap.set(result.testId, result);
              });
              
              // Then override with server results if they exist
              results.forEach(result => {
                resultMap.set(result.testId, result);
              });
              
              // Convert map back to array
              const mergedResults = Array.from(resultMap.values());
              setCognitiveTestResults(mergedResults);
            }
          } catch (error) {
            console.error("Error fetching results from server:", error);
            // Fall back to local results only
          }
        }
        
        // Set flag if any tests are completed
        if ((savedChecklistResults || (localTestResults && localTestResults.length > 0) || savedHandwritingResults)) {
          setHasCompletedAnyTest(true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading results",
          description: "There was a problem loading your assessment results.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Calculate checklist category score based on responses
  const calculateCategoryScore = (categoryId: string) => {
    if (!checklistResults?.responses) return 0;
    
    // Get the age group from the results or default to "school"
    const ageGroup = checklistResults.ageGroup || "school";
    
    // Get items in this category for the specific age group
    const categoryItems = checklistItems.filter(
      item => item.category === categoryId && item.ageGroups.includes(ageGroup)
    );
    
    // If no items for this category and age group, return 0
    if (categoryItems.length === 0) return 0;
    
    // Count positive responses 
    const positiveResponses = categoryItems.filter(item => checklistResults.responses[item.id] === true);
    
    return (positiveResponses.length / categoryItems.length) * 100;
  };

  // Get risk level based on score
  const getCategoryRiskLevel = (score: number) => {
    if (score >= 70) return { level: "High", color: "text-red-600" };
    if (score >= 40) return { level: "Moderate", color: "text-amber-600" };
    return { level: "Low", color: "text-green-600" };
  };

  // Get risk level for cognitive test results
  const getCognitiveTestRiskLevel = (testId: string) => {
    const result = cognitiveTestResults.find(r => r.testId === testId);
    
    if (!result) return { level: "Not Taken", color: "text-gray-400" };
    
    const score = result.score;
    
    // Reverse the risk assessment for cognitive tests since higher scores are better
    if (score >= 70) return { level: "Low", color: "text-green-600" };
    if (score >= 40) return { level: "Moderate", color: "text-amber-600" };
    return { level: "High", color: "text-red-600" };
  };

  // Get handwriting analysis risk level
  const getHandwritingRiskLevel = () => {
    if (!handwritingResults) return { level: "Not Taken", color: "text-gray-400" };
    
    const score = handwritingResults.dyslexiaIndicatorScore || 0;
    
    if (score >= 70) return { level: "High", color: "text-red-600" };
    if (score >= 40) return { level: "Moderate", color: "text-amber-600" };
    return { level: "Low", color: "text-green-600" };
  };

  // Get overall risk level
  const getOverallRiskLevel = () => {
    if (!checklistResults?.responses && cognitiveTestResults.length === 0 && !handwritingResults) {
      return { level: "Unknown", color: "text-gray-600" };
    }
    
    let totalScore = 0;
    let divisor = 0;
    
    // Include checklist scores
    if (checklistResults?.responses) {
      const categoryScores = checklistCategories.map(cat => calculateCategoryScore(cat.id))
        .filter(score => score > 0); // Only include categories that have results
      
      if (categoryScores.length > 0) {
        totalScore += categoryScores.reduce((sum, score) => sum + score, 0);
        divisor += categoryScores.length;
      }
    }
    
    // Include handwriting analysis score
    if (handwritingResults) {
      totalScore += handwritingResults.dyslexiaIndicatorScore || 0;
      divisor += 1;
    }
    
    // Include cognitive test scores (reversed because higher is better)
    if (cognitiveTestResults.length > 0) {
      const testScores = cognitiveTestResults.map(result => 100 - result.score); // Reverse for risk calculation
      totalScore += testScores.reduce((sum, score) => sum + score, 0);
      divisor += testScores.length;
    }
    
    const avgScore = divisor > 0 ? totalScore / divisor : 0;
    
    return getCategoryRiskLevel(avgScore);
  };

  // Navigate to the download report page
  const handleDownloadReport = () => {
    navigate("/report");
  };

  const navigateToNextAssessment = () => {
    if (!checklistResults) {
      navigate("/checklist");
      return;
    }
    
    if (!handwritingResults) {
      navigate("/handwriting-analysis");
      return;
    }
    
    const incompleteTests = cognitiveTests.filter(test => 
      !cognitiveTestResults.some(result => result.testId === test.id)
    );
    
    if (incompleteTests.length > 0) {
      navigate("/cognitive-tests");
      return;
    }
    
    // If everything is completed
    toast({
      title: "All assessments complete",
      description: "You've completed all available assessments. View your comprehensive report for insights.",
    });
  };

  // Render message when no data is available
  const renderNoDataMessage = () => {
    const hasProfile = userProfile !== null;
    
    return (
      <Card className="my-8">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2">No Assessment Data Available</h3>
            <p className="text-gray-600 mb-6">
              You haven't completed any assessments yet. Complete at least one assessment to see your results.
            </p>
            {!hasProfile && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Profile Required</AlertTitle>
                <AlertDescription>
                  Please set up your profile before taking assessments to ensure accurate results.
                </AlertDescription>
              </Alert>
            )}
            <div className={`${isMobile ? 'flex flex-col space-y-4' : 'space-x-4'}`}>
              {!hasProfile ? (
                <Button onClick={() => navigate("/profile")}>
                  Create Your Profile
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate("/checklist")}>
                    Take Checklist Assessment
                  </Button>
                  <Button onClick={() => navigate("/cognitive-tests")}>
                    Try Cognitive Tests
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Assessment Results</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : !hasCompletedAnyTest ? (
        renderNoDataMessage()
      ) : (
        <>
          <Card className="max-w-4xl mx-auto mb-8">
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <CardTitle>Your Dyslexia Risk Assessment</CardTitle>
                  <CardDescription>
                    These results are based on the assessments you've completed. More comprehensive results will be available as you complete additional tests.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadReport}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    <strong>Important Disclaimer:</strong> This assessment is not a clinical diagnosis. The results 
                    provide an indication of potential dyslexia traits based on your responses. For a formal diagnosis, 
                    please consult with a qualified educational psychologist or specialist.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Overall Risk Level:</h3>
                <div className="flex items-center space-x-4">
                  <span className={`text-2xl font-bold ${getOverallRiskLevel().color}`}>
                    {getOverallRiskLevel().level}
                  </span>
                  <span className="text-gray-500">
                    Based on {[
                      checklistResults ? "checklist" : "",
                      handwritingResults ? "handwriting analysis" : "",
                      cognitiveTestResults.length > 0 ? "cognitive tests" : ""
                    ].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Assessment Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Checklist Card */}
                  <Card className={checklistResults ? "border-green-300" : "border-gray-200"}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {checklistResults ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300 mr-2" />
                        )}
                        <h4 className="font-medium">Symptom Checklist</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {checklistResults 
                          ? `Completed for ${ageGroups.find(g => g.id === checklistResults.ageGroup)?.name || 'selected'} age group`
                          : "A questionnaire to identify dyslexia traits"
                        }
                      </p>
                      {!checklistResults && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate("/checklist")}
                        >
                          Take Assessment
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Handwriting Card */}
                  <Card className={handwritingResults ? "border-green-300" : "border-gray-200"}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {handwritingResults ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300 mr-2" />
                        )}
                        <h4 className="font-medium">Handwriting Analysis</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {handwritingResults 
                          ? `Completed on ${new Date(handwritingResults.completedAt).toLocaleDateString()}`
                          : "Analyzes handwriting patterns for dyslexia indicators"
                        }
                      </p>
                      {!handwritingResults && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate("/handwriting-analysis")}
                        >
                          Take Assessment
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Cognitive Tests Card */}
                  <Card className={cognitiveTestResults.length > 0 ? "border-green-300" : "border-gray-200"}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {cognitiveTestResults.length > 0 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300 mr-2" />
                        )}
                        <h4 className="font-medium">Cognitive Tests</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {cognitiveTestResults.length 
                          ? `${cognitiveTestResults.length} of ${cognitiveTests.length} tests completed`
                          : "Interactive tests of cognitive functions related to dyslexia"
                        }
                      </p>
                      {cognitiveTestResults.length < cognitiveTests.length && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate("/cognitive-tests")}
                        >
                          {cognitiveTestResults.length > 0 ? "Continue Tests" : "Take Tests"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                onClick={navigateToNextAssessment}
                className="flex items-center gap-2 w-full"
              >
                Continue to Next Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`${isMobile ? 'grid-cols-2' : 'grid-cols-4'} grid w-full`}>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="checklist" disabled={!checklistResults}>Checklist</TabsTrigger>
                {!isMobile && (
                  <TabsTrigger value="cognitive" disabled={cognitiveTestResults.length === 0}>Cognitive Tests</TabsTrigger>
                )}
                {!isMobile && (
                  <TabsTrigger value="handwriting" disabled={!handwritingResults}>Handwriting</TabsTrigger>
                )}
              </TabsList>
              
              {isMobile && (
                <TabsList className="grid grid-cols-2 w-full mt-1">
                  <TabsTrigger value="cognitive" disabled={cognitiveTestResults.length === 0}>Cognitive Tests</TabsTrigger>
                  <TabsTrigger value="handwriting" disabled={!handwritingResults}>Handwriting</TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="summary" className="p-6">
                <h3 className="text-xl font-medium mb-4">Assessment Overview</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Completed Assessments</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {checklistResults ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 mr-2" />
                        )}
                        <span>Symptom Checklist</span>
                      </div>
                      <div className="flex items-center">
                        {handwritingResults ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 mr-2" />
                        )}
                        <span>Handwriting Analysis</span>
                      </div>
                      <div className="flex items-center">
                        {cognitiveTestResults.length > 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 mr-2" />
                        )}
                        <span>
                          Cognitive Tests ({cognitiveTestResults.length} of {cognitiveTests.length} completed)
                        </span>
                      </div>
                    </div>
                  </div>

                  {checklistResults && (
                    <div>
                      <h4 className="font-medium mb-2">Checklist Result Breakdown</h4>
                      <div className="space-y-4">
                        {checklistCategories.map(category => {
                          const score = calculateCategoryScore(category.id);
                          // Skip categories with no results for this age group
                          if (score === 0) return null;
                          
                          const risk = getCategoryRiskLevel(score);
                          
                          return (
                            <div key={category.id} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span>{category.name}</span>
                                <span className={risk.color}>{risk.level} Risk</span>
                              </div>
                              <Progress value={score} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {handwritingResults && (
                    <div>
                      <h4 className="font-medium mb-2">Handwriting Analysis Results</h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>Dyslexia Indicators</span>
                            <span className={getHandwritingRiskLevel().color}>
                              {getHandwritingRiskLevel().level} Risk
                            </span>
                          </div>
                          <Progress value={handwritingResults.dyslexiaIndicatorScore || 0} className="h-2" />
                        </div>
                        
                        {handwritingResults.keyFeatures && (
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="font-medium mb-1">Key Features Identified:</p>
                            <ul className="list-disc pl-5">
                              {handwritingResults.keyFeatures.map((feature: string, index: number) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {cognitiveTestResults.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Cognitive Tests Breakdown</h4>
                      <div className="space-y-4">
                        {cognitiveTests.map(test => {
                          const risk = getCognitiveTestRiskLevel(test.id);
                          const result = cognitiveTestResults.find(r => r.testId === test.id);
                          const score = result ? result.score : 0;
                          
                          return (
                            <div key={test.id} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span>{test.title}</span>
                                <span className={risk.color}>{risk.level} Risk</span>
                              </div>
                              <Progress value={result ? score : 0} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Alert>
                    <AlertTitle>Next Steps</AlertTitle>
                    <AlertDescription>
                      For a more comprehensive assessment, consider completing the remaining tests. 
                      To get a professional evaluation, bring these results to an educational psychologist 
                      or dyslexia specialist.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center mt-6">
                    <Button 
                      onClick={handleDownloadReport}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <FileDown className="h-4 w-4" />
                      Download Full Report
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="checklist" className="p-6">
                {checklistResults ? (
                  <div className="space-y-8">
                    <h3 className="text-xl font-medium mb-2">Detailed Checklist Results</h3>
                    <p className="text-gray-600">
                      Age Group: <span className="font-medium">
                        {ageGroups.find(g => g.id === checklistResults.ageGroup)?.name || 'Unknown'} 
                        ({ageGroups.find(g => g.id === checklistResults.ageGroup)?.ageRange})
                      </span>
                    </p>
                    
                    {checklistCategories.map(category => {
                      // Get items for this category and age group
                      const categoryItems = checklistItems.filter(
                        item => item.category === category.id && 
                        item.ageGroups.includes(checklistResults.ageGroup || "school")
                      );
                      
                      // Skip categories with no items for this age group
                      if (categoryItems.length === 0) return null;
                      
                      const score = calculateCategoryScore(category.id);
                      const risk = getCategoryRiskLevel(score);
                      
                      return (
                        <div key={category.id} className="space-y-4">
                          <div>
                            <h4 className="text-lg font-medium">{category.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`font-semibold ${risk.color}`}>{risk.level} Risk</span>
                              <span className="text-gray-500">({Math.round(score)}% indicators present)</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 ml-4">
                            {categoryItems.map(item => (
                              <div key={item.id} className="flex items-start">
                                <div className={`w-4 h-4 rounded-full mt-1 mr-2 ${
                                  checklistResults.responses[item.id] === true ? 'bg-red-500' : 'bg-gray-300'
                                }`}></div>
                                <span className={checklistResults.responses[item.id] === true ? 'font-medium' : ''}>
                                  {item.question}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/checklist")}
                        className="mr-2"
                      >
                        Retake Assessment
                      </Button>
                      <Button onClick={navigateToNextAssessment}>
                        Continue Testing
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-6">
                      You haven't completed the checklist assessment yet.
                    </p>
                    <Button onClick={() => navigate("/checklist")}>
                      Take Checklist Assessment
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cognitive" className="p-6">
                <h3 className="text-xl font-medium mb-4">Cognitive Test Results</h3>
                
                {cognitiveTestResults.length > 0 ? (
                  <div className="space-y-6">
                    {cognitiveTests.map(test => {
                      const result = cognitiveTestResults.find(r => r.testId === test.id);
                      if (!result) return (
                        <Card key={test.id} className="bg-gray-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{test.title}</CardTitle>
                            <CardDescription>Not completed yet</CardDescription>
                          </CardHeader>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate("/cognitive-tests")}
                            >
                              Take Test
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                      
                      const risk = getCognitiveTestRiskLevel(test.id);
                      
                      return (
                        <Card key={test.id}>
                          <CardHeader>
                            <CardTitle className="text-base">{test.title}</CardTitle>
                            <CardDescription>{test.category} skills assessment</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span>Performance Score:</span>
                                <span className="font-medium">{Math.round(result.score)}/100</span>
                              </div>
                              <Progress value={result.score} className="h-2" />
                              
                              <div className="flex items-center justify-between">
                                <span>Risk Level:</span>
                                <span className={`font-medium ${risk.color}`}>{risk.level}</span>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                <div>Time Spent: {Math.round(result.timeSpent)} seconds</div>
                                <div>Completed: {new Date(result.completedAt).toLocaleDateString()}</div>
                                {result.interpretation && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                    <strong>Interpretation:</strong> {result.interpretation}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    <div className="mt-4 flex flex-wrap gap-4 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/cognitive-tests")}
                      >
                        Take More Tests
                      </Button>
                      
                      <Button 
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2"
                      >
                        <FileDown className="h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-6">
                      You haven't completed any cognitive tests yet.
                    </p>
                    <Button onClick={() => navigate("/cognitive-tests")}>
                      Go to Cognitive Tests
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="handwriting" className="p-6">
                <h3 className="text-xl font-medium mb-4">Handwriting Analysis</h3>
                
                {handwritingResults ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Analysis Summary</CardTitle>
                            <CardDescription>Completed on {new Date(handwritingResults.completedAt).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span>Dyslexia Indicator Score:</span>
                                <span className="font-medium">{handwritingResults.dyslexiaIndicatorScore}/100</span>
                              </div>
                              <Progress 
                                value={handwritingResults.dyslexiaIndicatorScore} 
                                className="h-2" 
                              />
                              
                              <div className="flex items-center justify-between">
                                <span>Risk Level:</span>
                                <span className={`font-medium ${getHandwritingRiskLevel().color}`}>
                                  {getHandwritingRiskLevel().level}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Key Features Identified</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {handwritingResults.keyFeatures ? (
                                handwritingResults.keyFeatures.map((feature: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                                    <span>{feature}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500">No specific features identified</li>
                              )}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    {handwritingResults.sampleImage && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Handwriting Sample</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                          <div className="border p-4 rounded-md max-w-md">
                            <img 
                              src={handwritingResults.sampleImage} 
                              alt="Handwriting Sample" 
                              className="max-w-full h-auto"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {handwritingResults.recommendations && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {handwritingResults.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/handwriting-analysis")}
                        className="mr-2"
                      >
                        Retake Analysis
                      </Button>
                      <Button onClick={navigateToNextAssessment}>
                        Continue Testing
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-6">
                      You haven't completed the handwriting analysis yet.
                    </p>
                    <Button onClick={() => navigate("/handwriting-analysis")}>
                      Take Handwriting Analysis
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  );
};

export default Results;
