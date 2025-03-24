
import React, { useState, useEffect } from "react";
import TestSelector from "@/components/cognitive-tests/TestSelector";
import RapidNamingTest from "@/components/cognitive-tests/RapidNamingTest";
import PhonemicAwarenessTest from "@/components/cognitive-tests/PhonemicAwarenessTest";
import ImprovedWorkingMemoryTest from "@/components/cognitive-tests/ImprovedWorkingMemoryTest";
import VisualProcessingTest from "@/components/cognitive-tests/VisualProcessingTest";
import ProcessingSpeedTest from "@/components/cognitive-tests/ProcessingSpeedTest";
import SequencingTest from "@/components/cognitive-tests/SequencingTest";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileCheck } from "@/hooks/useProfileCheck";

const CognitiveTests = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userAge } = useProfileCheck();

  // Check for test ID in URL params when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get("test");
    if (testId) {
      setSelectedTest(testId);
    }
  }, []);

  const handleTestComplete = () => {
    navigate("/results");
  };

  const handleCancel = () => {
    setSelectedTest(null);
  };
  
  const navigateToNextTest = () => {
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
      setSelectedTest(testOrder[currentIndex + 1]);
    } else {
      // If we're at the end of the tests, go to results
      handleTestComplete();
    }
  };

  const renderSelectedTest = () => {
    const commonProps = {
      onComplete: handleTestComplete,
      onCancel: handleCancel,
      onNext: navigateToNextTest
    };

    switch (selectedTest) {
      case "rapid-naming":
        return <RapidNamingTest {...commonProps} />;
      case "phonemic-awareness":
        return <PhonemicAwarenessTest {...commonProps} />;
      case "working-memory":
        return <ImprovedWorkingMemoryTest {...commonProps} userAge={userAge || undefined} />;
      case "visual-processing":
        return <VisualProcessingTest {...commonProps} />;
      case "processing-speed":
        return <ProcessingSpeedTest {...commonProps} />;
      case "sequencing":
        return <SequencingTest {...commonProps} />;
      default:
        return null;
    }
  };

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
