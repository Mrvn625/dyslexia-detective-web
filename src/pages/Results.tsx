
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChecklistResponse } from "@/types/checklist";
import { checklistItems, checklistCategories } from "@/data/checklistData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, Circle, FileDown } from "lucide-react";
import { TestResult, cognitiveTests } from "@/data/cognitiveTestsData";
import { getTestResults } from "@/utils/testUtils";
import { getTestResults as getServerTestResults } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Results = () => {
  const [checklistResults, setChecklistResults] = useState<ChecklistResponse | null>(null);
  const [cognitiveTestResults, setCognitiveTestResults] = useState<TestResult[]>([]);
  const [serverResults, setServerResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const [hasCompletedAnyTest, setHasCompletedAnyTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Function to load all data
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load checklist results from localStorage
        const savedChecklistResults = localStorage.getItem("checklistResults");
        if (savedChecklistResults) {
          setChecklistResults(JSON.parse(savedChecklistResults));
        }
        
        // Load cognitive test results from localStorage
        const localTestResults = getTestResults();
        if (localTestResults && localTestResults.length > 0) {
          setCognitiveTestResults(localTestResults);
        }
        
        // Try to load results from server if user is logged in
        const userId = localStorage.getItem("userId");
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
        if ((savedChecklistResults || (localTestResults && localTestResults.length > 0))) {
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

  // Calculate checklist category score
  const calculateCategoryScore = (categoryId: string) => {
    if (!checklistResults) return 0;
    
    const categoryItems = checklistItems.filter(item => item.category === categoryId);
    const positiveResponses = categoryItems.filter(item => checklistResults[item.id] === true);
    
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

  // Get overall risk level
  const getOverallRiskLevel = () => {
    if (!checklistResults && cognitiveTestResults.length === 0) {
      return { level: "Unknown", color: "text-gray-600" };
    }
    
    let totalScore = 0;
    let divisor = 0;
    
    // Include checklist scores
    if (checklistResults) {
      const categoryScores = checklistCategories.map(cat => calculateCategoryScore(cat.id));
      totalScore += categoryScores.reduce((sum, score) => sum + score, 0);
      divisor += categoryScores.length;
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

  // Render message when no data is available
  const renderNoDataMessage = () => (
    <Card className="my-8">
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-medium mb-2">No Assessment Data Available</h3>
          <p className="text-gray-600 mb-6">
            You haven't completed any assessments yet. Complete at least one assessment to see your results.
          </p>
          <div className={`${isMobile ? 'flex flex-col space-y-4' : 'space-x-4'}`}>
            <Button variant="outline" onClick={() => navigate("/checklist")}>
              Take Checklist Assessment
            </Button>
            <Button onClick={() => navigate("/cognitive-tests")}>
              Try Cognitive Tests
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                    Based on {checklistResults ? "checklist" : ""}{checklistResults && cognitiveTestResults.length > 0 ? " and " : ""}
                    {cognitiveTestResults.length > 0 ? "cognitive tests" : ""}
                  </span>
                </div>
              </div>
            </CardContent>
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
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                )}
              </TabsList>
              
              {isMobile && (
                <TabsList className="grid grid-cols-2 w-full mt-1">
                  <TabsTrigger value="cognitive" disabled={cognitiveTestResults.length === 0}>Cognitive Tests</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
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
                        <Circle className="w-4 h-4 text-gray-300 mr-2" />
                        <span>Handwriting Analysis (Not completed)</span>
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
                {checklistResults && (
                  <div className="space-y-8">
                    <h3 className="text-xl font-medium mb-2">Detailed Checklist Results</h3>
                    
                    {checklistCategories.map(category => {
                      const categoryItems = checklistItems.filter(item => item.category === category.id);
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
                                  checklistResults[item.id] === true ? 'bg-red-500' : 'bg-gray-300'
                                }`}></div>
                                <span className={checklistResults[item.id] === true ? 'font-medium' : ''}>
                                  {item.question}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
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

              <TabsContent value="recommendations" className="p-6">
                <h3 className="text-xl font-medium mb-4">Recommendations & Resources</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Next Steps</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Complete all available assessments for a more comprehensive profile</li>
                      <li>Consult with an educational psychologist or dyslexia specialist for formal evaluation</li>
                      <li>Share these results with teachers, tutors, or support staff who work with you or your child</li>
                      <li>Explore dyslexia support organizations for additional resources and community</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Helpful Resources</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">International Dyslexia Association</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">Comprehensive information, research, and resources about dyslexia</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <a href="https://dyslexiaida.org/" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Visit Website</Button>
                          </a>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">Understood.org</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">Support for parents and individuals with learning differences</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <a href="https://www.understood.org/" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Visit Website</Button>
                          </a>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">Yale Center for Dyslexia & Creativity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">Research and resources highlighting strengths of dyslexic thinking</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <a href="https://dyslexia.yale.edu/" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Visit Website</Button>
                          </a>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">Learning Ally</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">Audiobook solutions and support for dyslexic readers</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <a href="https://learningally.org/" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Visit Website</Button>
                          </a>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Accommodations & Strategies</h4>
                    <p className="mb-3">
                      Depending on your assessment results, these strategies may be helpful:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Text-to-speech and speech-to-text technologies</li>
                      <li>Structured literacy approaches for reading instruction</li>
                      <li>Extended time for reading and writing tasks</li>
                      <li>Use of graphic organizers for planning written work</li>
                      <li>Audiobooks and recorded materials</li>
                      <li>Color-coding systems for organization</li>
                      <li>Breaking tasks into smaller, manageable parts</li>
                    </ul>
                  </div>
                  
                  <div className="text-center mt-6">
                    <Button 
                      onClick={handleDownloadReport}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <FileDown className="h-4 w-4" />
                      Download Comprehensive Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  );
};

export default Results;
