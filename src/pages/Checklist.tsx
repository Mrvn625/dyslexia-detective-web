
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { checklistItems, checklistCategories, ageGroups } from "@/data/checklistData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ChecklistResponse } from "@/types/checklist";
import { getUserProfile } from "@/services/api";
import { useNavigate } from "react-router-dom";

const Checklist = () => {
  const [activeTab, setActiveTab] = useState(checklistCategories[0].id);
  const [responses, setResponses] = useState<ChecklistResponse>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("school");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const profile = await getUserProfile(userId);
          setUserProfile(profile);
          
          // Set age group based on user profile age
          if (profile?.age) {
            if (profile.age < 6) {
              setSelectedAgeGroup("preschool");
            } else if (profile.age < 13) {
              setSelectedAgeGroup("school");
            } else if (profile.age < 18) {
              setSelectedAgeGroup("adolescent");
            } else {
              setSelectedAgeGroup("adult");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleResponse = (itemId: string, value: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const getFilteredItems = (categoryId: string) => {
    return checklistItems.filter(
      item => item.category === categoryId && item.ageGroups.includes(selectedAgeGroup)
    );
  };

  const calculateCategoryProgress = (categoryId: string) => {
    const categoryItems = getFilteredItems(categoryId);
    if (categoryItems.length === 0) return 100; // If no items for this category and age group, mark as complete
    
    const answeredItems = categoryItems.filter(item => responses[item.id] !== undefined);
    return (answeredItems.length / categoryItems.length) * 100;
  };

  const isCategoryComplete = (categoryId: string) => {
    return calculateCategoryProgress(categoryId) === 100;
  };

  const calculateOverallProgress = () => {
    let totalItems = 0;
    let answeredItems = 0;
    
    checklistCategories.forEach(category => {
      const items = getFilteredItems(category.id);
      totalItems += items.length;
      answeredItems += items.filter(item => responses[item.id] !== undefined).length;
    });
    
    return totalItems > 0 ? (answeredItems / totalItems) * 100 : 100;
  };

  const handleContinue = () => {
    if (!isCategoryComplete(activeTab)) {
      toast({
        title: "Incomplete section",
        description: "Please answer all questions in this section before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Mark current category as completed if not already
    if (!completedCategories.includes(activeTab)) {
      setCompletedCategories([...completedCategories, activeTab]);
    }

    // Find the next category that has items for this age group
    const currentIndex = checklistCategories.findIndex(cat => cat.id === activeTab);
    let nextCategoryIndex = currentIndex + 1;
    
    while (
      nextCategoryIndex < checklistCategories.length && 
      getFilteredItems(checklistCategories[nextCategoryIndex].id).length === 0
    ) {
      nextCategoryIndex++;
    }
    
    if (nextCategoryIndex < checklistCategories.length) {
      setActiveTab(checklistCategories[nextCategoryIndex].id);
    } else {
      // All categories completed
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (calculateOverallProgress() < 100) {
      toast({
        title: "Checklist incomplete",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Store results in localStorage for the Results page to use
    const resultsWithMetadata = {
      responses,
      ageGroup: selectedAgeGroup,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem("checklistResults", JSON.stringify(resultsWithMetadata));
    
    toast({
      title: "Checklist completed",
      description: "Your responses have been saved. Proceed to the results page.",
    });
    
    // Navigate to results
    navigate("/results");
  };

  // Handle age group change
  const handleAgeGroupChange = (value: string) => {
    // Confirm change if there are already responses
    if (Object.keys(responses).length > 0) {
      if (window.confirm("Changing the age group will reset your current responses. Continue?")) {
        setSelectedAgeGroup(value);
        setResponses({});
        setCompletedCategories([]);
        setActiveTab(checklistCategories[0].id); // Reset to first category
      }
    } else {
      setSelectedAgeGroup(value);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Dyslexia Symptoms Checklist</h1>
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Dyslexia Symptoms Checklist</h1>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Required</CardTitle>
            <CardDescription>
              Please create a user profile before taking the assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Profile Missing</AlertTitle>
              <AlertDescription>
                A user profile with basic information is required to provide accurate assessment results.
              </AlertDescription>
            </Alert>
            
            <p className="mb-6 text-gray-600">
              We need basic information like age to customize the assessment questions appropriately.
              Your information will be used only for assessment purposes.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/profile")}
              className="w-full"
            >
              Create Your Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Dyslexia Symptoms Checklist</h1>
      
      <Card className="max-w-3xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Answer all questions to the best of your knowledge. This checklist helps identify potential signs of dyslexia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="age-group" className="mb-2 block">Select Age Group</Label>
            <Select 
              value={selectedAgeGroup} 
              onValueChange={handleAgeGroupChange}
            >
              <SelectTrigger id="age-group" className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.ageRange})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              {ageGroups.find(g => g.id === selectedAgeGroup)?.description}
            </p>
          </div>
          
          <p className="mb-2">
            For each statement, select whether it applies to you or the person you are assessing:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><span className="font-medium">Yes</span> - The behavior is consistently observed</li>
            <li><span className="font-medium">No</span> - The behavior is rarely or never observed</li>
          </ul>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall progress</span>
              <span>{Math.round(calculateOverallProgress())}% complete</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto">
            {checklistCategories.map((category) => {
              const hasItems = getFilteredItems(category.id).length > 0;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="relative py-2"
                  disabled={!hasItems}
                >
                  {category.name}
                  {isCategoryComplete(category.id) && hasItems && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {checklistCategories.map((category) => {
            const filteredItems = getFilteredItems(category.id);
            return (
              <TabsContent key={category.id} value={category.id} className="pt-6">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredItems.length > 0 ? (
                    <div className="space-y-6">
                      {filteredItems.map(item => (
                        <div key={item.id} className="space-y-2">
                          <p className="font-medium">{item.question}</p>
                          <RadioGroup 
                            value={responses[item.id]?.toString() || ""} 
                            onValueChange={(value) => handleResponse(item.id, value === "true")}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`${item.id}-yes`} />
                              <Label htmlFor={`${item.id}-yes`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`${item.id}-no`} />
                              <Label htmlFor={`${item.id}-no`}>No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No questions available for this category in the selected age group.
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Find previous category that has items
                        const currentIndex = checklistCategories.findIndex(cat => cat.id === activeTab);
                        let prevCategoryIndex = currentIndex - 1;
                        
                        while (
                          prevCategoryIndex >= 0 && 
                          getFilteredItems(checklistCategories[prevCategoryIndex].id).length === 0
                        ) {
                          prevCategoryIndex--;
                        }
                        
                        if (prevCategoryIndex >= 0) {
                          setActiveTab(checklistCategories[prevCategoryIndex].id);
                        }
                      }}
                      disabled={checklistCategories.findIndex(cat => cat.id === activeTab) === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleContinue}
                      disabled={filteredItems.length === 0}
                    >
                      {(() => {
                        // Find next category that has items
                        const currentIndex = checklistCategories.findIndex(cat => cat.id === activeTab);
                        let nextCategoryIndex = currentIndex + 1;
                        
                        while (
                          nextCategoryIndex < checklistCategories.length && 
                          getFilteredItems(checklistCategories[nextCategoryIndex].id).length === 0
                        ) {
                          nextCategoryIndex++;
                        }
                        
                        return nextCategoryIndex < checklistCategories.length 
                          ? "Continue" 
                          : "Complete Checklist";
                      })()}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>
    </div>
  );
};

export default Checklist;
