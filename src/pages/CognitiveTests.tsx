
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import TestSelector from "@/components/cognitive-tests/TestSelector";
import RapidNamingTest from "@/components/cognitive-tests/RapidNamingTest";

interface TestResult {
  testId: string;
  score: number;
  timeSpent: number;
  completedAt: string;
  responses: any[];
}

const CognitiveTests = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load completed tests from localStorage on mount
  useEffect(() => {
    const testResults = localStorage.getItem("testResults");
    if (testResults) {
      const results = JSON.parse(testResults) as TestResult[];
      const completedTestIds = [...new Set(results.map((r: TestResult) => r.testId))];
      setCompletedTests(completedTestIds);
    }
  }, []);

  const handleSelectTest = (testId: string) => {
    setSelectedTest(testId);
  };

  const handleCompleteTest = () => {
    // Add the test to completed tests
    if (selectedTest && !completedTests.includes(selectedTest)) {
      const updatedCompletedTests = [...completedTests, selectedTest];
      setCompletedTests(updatedCompletedTests);
    }
    
    // Show toast and reset selected test
    toast({
      title: "Test completed",
      description: "Your test results have been saved and will be included in your assessment.",
    });
    
    setSelectedTest(null);
  };

  const handleCancelTest = () => {
    toast({
      title: "Test cancelled",
      description: "You can try this test again later.",
    });
    setSelectedTest(null);
  };

  // Render the appropriate test component based on the selected test
  const renderTestComponent = () => {
    switch (selectedTest) {
      case "rapid-naming":
        return (
          <RapidNamingTest 
            onComplete={handleCompleteTest} 
            onCancel={handleCancelTest} 
          />
        );
      case "phonemic-awareness":
      case "working-memory":
      case "visual-processing":
      case "processing-speed":
      case "sequencing":
        // For now, show a placeholder for tests that aren't implemented yet
        return (
          <Card className="max-w-3xl mx-auto mt-8">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
                <p className="mb-6">
                  This test is currently under development. Please try one of the other available tests.
                </p>
                <Button onClick={() => setSelectedTest(null)}>
                  Return to Test Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Cognitive Tests</h1>
      
      {!selectedTest && (
        <>
          <div className="mb-8 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Cognitive Assessments</CardTitle>
                <CardDescription>
                  These tests measure specific cognitive skills related to dyslexia. Complete each test to gather comprehensive assessment data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Each test focuses on a different cognitive area that may be affected in individuals with dyslexia. 
                  The tests are designed to be engaging while providing valuable assessment data.
                </p>
                
                {completedTests.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      <strong>Great progress!</strong> You've completed {completedTests.length} out of {cognitiveTests.length} tests.
                      {completedTests.length === cognitiveTests.length && " You've completed all available tests!"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <TestSelector onSelectTest={handleSelectTest} />
          
          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate("/results")}
              variant="outline"
              className="mx-auto"
            >
              View Results
            </Button>
          </div>
        </>
      )}
      
      {selectedTest && renderTestComponent()}
    </div>
  );
};

export default CognitiveTests;
