
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { checklistItems, checklistCategories } from "@/data/checklistData";
import { ChecklistResponse } from "@/types/checklist";
import { useNavigate } from "react-router-dom";

const Checklist = () => {
  const [activeTab, setActiveTab] = useState(checklistCategories[0].id);
  const [responses, setResponses] = useState<ChecklistResponse>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResponse = (itemId: string, value: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const calculateCategoryProgress = (categoryId: string) => {
    const categoryItems = checklistItems.filter(item => item.category === categoryId);
    const answeredItems = categoryItems.filter(item => responses[item.id] !== undefined);
    return (answeredItems.length / categoryItems.length) * 100;
  };

  const isCategoryComplete = (categoryId: string) => {
    return calculateCategoryProgress(categoryId) === 100;
  };

  const calculateOverallProgress = () => {
    const answeredItems = Object.keys(responses).length;
    return (answeredItems / checklistItems.length) * 100;
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

    // Find the next category
    const currentIndex = checklistCategories.findIndex(cat => cat.id === activeTab);
    if (currentIndex < checklistCategories.length - 1) {
      setActiveTab(checklistCategories[currentIndex + 1].id);
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
    localStorage.setItem("checklistResults", JSON.stringify(responses));
    
    toast({
      title: "Checklist completed",
      description: "Your responses have been saved. Proceed to the results page.",
    });
    
    // Navigate to results or next test
    navigate("/results");
  };

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
            {checklistCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="relative py-2"
              >
                {category.name}
                {isCategoryComplete(category.id) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {checklistCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="pt-6">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {checklistItems
                    .filter(item => item.category === category.id)
                    .map(item => (
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

                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const currentIndex = checklistCategories.findIndex(cat => cat.id === activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(checklistCategories[currentIndex - 1].id);
                      }
                    }}
                    disabled={checklistCategories.findIndex(cat => cat.id === activeTab) === 0}
                  >
                    Previous
                  </Button>
                  <Button onClick={handleContinue}>
                    {checklistCategories.findIndex(cat => cat.id === activeTab) === checklistCategories.length - 1 
                      ? "Complete Checklist" 
                      : "Continue"}
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Checklist;
