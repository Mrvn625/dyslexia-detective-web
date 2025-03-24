
import React, { useState, useEffect } from "react";
import TestSelector from "@/components/cognitive-tests/TestSelector";
import RapidNamingTest from "@/components/cognitive-tests/RapidNamingTest";
import PhonemicAwarenessTest from "@/components/cognitive-tests/PhonemicAwarenessTest";
import WorkingMemoryTest from "@/components/cognitive-tests/WorkingMemoryTest";
import VisualProcessingTest from "@/components/cognitive-tests/VisualProcessingTest";
import ProcessingSpeedTest from "@/components/cognitive-tests/ProcessingSpeedTest";
import SequencingTest from "@/components/cognitive-tests/SequencingTest";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileCheck } from "@/hooks/useProfileCheck";
import { useProfileGuard } from "@/utils/profileGuard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

const CognitiveTests = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userAge } = useProfileCheck();
  const { isLoading, hasProfile } = useProfileGuard();
  const { toast } = useToast();

  // Check for test ID in URL params when component mounts
  useEffect(() => {
    try {
      if (hasProfile) {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get("test");
        if (testId) {
          const validTests = ["rapid-naming", "phonemic-awareness", "working-memory", 
                             "visual-processing", "processing-speed", "sequencing"];
          
          if (validTests.includes(testId)) {
            setSelectedTest(testId);
          } else {
            setError(`Unknown test type: ${testId}`);
            toast({
              title: "Invalid Test",
              description: `The test "${testId}" does not exist.`,
              variant: "destructive",
            });
          }
        }
      }
    } catch (e) {
      console.error("Error parsing test from URL:", e);
      setError("Could not parse test from URL");
    }
  }, [hasProfile, toast]);

  const handleTestComplete = () => {
    toast({
      title: "Test Completed",
      description: "Your test results have been saved.",
    });
    navigate("/results");
  };

  const handleCancel = () => {
    setSelectedTest(null);
    setError(null);
  };
  
  const navigateToNextTest = () => {
    try {
      // Determine the next test to take based on current test
      const testOrder = [
        "rapid-naming", 
        "phonemic-awareness", 
        "working-memory", 
        "visual-processing", 
        "processing-speed", 
        "sequencing"
      ];
      
      const currentIndex = testOrder.indexOf(selectedTest || "");
      if (currentIndex >= 0 && currentIndex < testOrder.length - 1) {
        toast({
          title: "Moving to Next Test",
          description: `Loading the ${testOrder[currentIndex + 1].replace('-', ' ')} test.`,
        });
        setSelectedTest(testOrder[currentIndex + 1]);
      } else {
        // If we're at the end of the tests, go to results
        toast({
          title: "All Tests Completed",
          description: "You've completed all the cognitive tests!",
        });
        handleTestComplete();
      }
    } catch (e) {
      console.error("Error navigating to next test:", e);
      setError("Could not navigate to the next test");
      toast({
        title: "Navigation Error",
        description: "There was a problem moving to the next test.",
        variant: "destructive",
      });
    }
  };

  const renderSelectedTest = () => {
    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    
    const commonProps = {
      onComplete: handleTestComplete,
      onCancel: handleCancel,
      onNext: navigateToNextTest
    };

    try {
      switch (selectedTest) {
        case "rapid-naming":
          return <RapidNamingTest {...commonProps} />;
        case "phonemic-awareness":
          return <PhonemicAwarenessTest {...commonProps} />;
        case "working-memory":
          return <WorkingMemoryTest {...commonProps} userAge={userAge || undefined} />;
        case "visual-processing":
          return <VisualProcessingTest {...commonProps} />;
        case "processing-speed":
          return <ProcessingSpeedTest {...commonProps} />;
        case "sequencing":
          return <SequencingTest {...commonProps} />;
        default:
          return null;
      }
    } catch (e) {
      console.error("Error rendering test:", e);
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Test Error</AlertTitle>
          <AlertDescription>
            There was a problem loading the test. Please try again or select a different test.
          </AlertDescription>
        </Alert>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-60 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Required</AlertTitle>
          <AlertDescription>
            You need to create a profile before you can take cognitive tests.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/user-profile")}>
            Create Your Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!selectedTest ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-blue-700">Cognitive Tests</h1>
              <p className="text-gray-600">
                Complete these interactive assessments to evaluate cognitive functions associated with dyslexia.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => navigate("/how-tests-work")}
            >
              Learn How Tests Work
            </Button>
          </div>

          <TestSelector onSelectTest={setSelectedTest} />
        </>
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-0 left-0 flex items-center"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tests
          </Button>
          <div className="mt-12">
            {renderSelectedTest()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveTests;
