
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";

// Visual processing test items
const visualItems = [
  {
    id: 'vp1',
    type: 'matching',
    question: "Which symbol is identical to the one on the left?",
    target: "⌘",
    options: ["⌖", "⌘", "⍚", "⌗"],
    correctOption: 1
  },
  {
    id: 'vp2',
    type: 'oddOneOut',
    question: "Find the symbol that is different from the others",
    options: ["◈", "◈", "◈", "◇", "◈"],
    correctOption: 3
  },
  {
    id: 'vp3',
    type: 'matching',
    question: "Which symbol is identical to the one on the left?",
    target: "₰",
    options: ["₰", "₲", "₱", "₳"],
    correctOption: 0
  },
  {
    id: 'vp4',
    type: 'oddOneOut',
    question: "Find the symbol that is different from the others",
    options: ["⊕", "⊕", "⊗", "⊕", "⊕"],
    correctOption: 2
  },
  {
    id: 'vp5',
    type: 'matching',
    question: "Which symbol is identical to the one on the left?",
    target: "ℵ",
    options: ["ℶ", "ℷ", "ℸ", "ℵ"],
    correctOption: 3
  },
  {
    id: 'vp6',
    type: 'reversal',
    question: "Which letter is reversed?",
    options: ["p", "q", "b", "d"], // d is correctly oriented here, this is just an example
    correctOption: 1 // this would be the index of the reversed letter
  }
];

const VisualProcessingTest: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [testInProgress, setTestInProgress] = useState(false);
  const [responses, setResponses] = useState<Array<{
    itemId: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    responseTime: number;
  }>>([]);
  const [itemStartTime, setItemStartTime] = useState<number>(0);
  const { toast } = useToast();
  
  const test = cognitiveTests.find(test => test.id === "visual-processing")!;
  const currentItem = visualItems[currentItemIndex];
  
  const startTest = () => {
    setTestInProgress(true);
    setTestStartTime(Date.now());
    setItemStartTime(Date.now());
    setCurrentItemIndex(0);
    setResponses([]);
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  const handleNextItem = () => {
    if (selectedOption === null) {
      toast({
        title: "No option selected",
        description: "Please select an option before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    const responseTime = (Date.now() - itemStartTime) / 1000;
    const isCorrect = selectedOption === currentItem.correctOption;
    
    // Record response
    setResponses(prev => [
      ...prev,
      {
        itemId: currentItem.id,
        selectedOption,
        correctOption: currentItem.correctOption,
        isCorrect,
        responseTime
      }
    ]);
    
    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Good eye! Moving to the next item." 
        : "Try to look for subtle differences.",
      variant: isCorrect ? "default" : "destructive"
    });
    
    // Move to next item or complete test
    if (currentItemIndex < visualItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setSelectedOption(null);
      setItemStartTime(Date.now());
    } else {
      completeTest();
    }
  };
  
  const completeTest = () => {
    if (!testInProgress) return;
    
    const timeSpent = (Date.now() - testStartTime) / 1000;
    
    // Calculate scores
    const correctResponses = responses.filter(r => r.isCorrect).length;
    
    // Basic score calculation - percentage of correct responses
    const percentageCorrect = (correctResponses / visualItems.length) * 100;
    
    // Adjust score based on response times
    // Faster response times = higher score (within reasonable limits)
    const avgResponseTime = responses.reduce((total, r) => total + r.responseTime, 0) / responses.length;
    const timeBonus = Math.max(0, Math.min(20, 20 * (1 - (avgResponseTime / 10)))); // Max 20% bonus for fast responses
    
    const score = Math.min(100, Math.round(percentageCorrect + timeBonus));
    
    // Save test result
    saveTestResult({
      testId: "visual-processing",
      score,
      timeSpent,
      completedAt: new Date().toISOString(),
      responses
    });
    
    toast({
      title: "Test completed",
      description: `Your score: ${score}% (${correctResponses} of ${visualItems.length} correct)`,
    });
    
    setTestInProgress(false);
    onComplete();
  };
  
  const renderItem = () => {
    switch (currentItem.type) {
      case 'matching':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="border-2 rounded-md p-6 bg-white">
                <span className="text-6xl">{currentItem.target}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentItem.options.map((option, index) => (
                <button
                  key={index}
                  className={`border-2 rounded-md p-4 text-4xl transition-all ${
                    selectedOption === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'oddOneOut':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {currentItem.options.map((option, index) => (
                <button
                  key={index}
                  className={`border-2 rounded-md p-4 text-3xl transition-all ${
                    selectedOption === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'reversal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentItem.options.map((option, index) => (
                <button
                  key={index}
                  className={`border-2 rounded-md p-6 text-6xl transition-all ${
                    selectedOption === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return <div>Invalid item type</div>;
    }
  };
  
  return (
    <TestContainer
      test={test}
      currentStep={currentItemIndex + 1}
      totalSteps={visualItems.length}
      onComplete={completeTest}
      onCancel={onCancel}
      showTimer={testInProgress}
    >
      {!testInProgress ? (
        <div className="text-center py-6">
          <p className="mb-4">
            This test evaluates your visual processing skills - the ability to distinguish between 
            similar symbols, identify patterns, and detect visual differences.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Research shows that visual processing difficulties are common in individuals with dyslexia, 
            which can affect letter recognition and reading fluency.
          </p>
          <Button onClick={startTest}>
            Start Test
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-center mb-4">{currentItem.question}</h3>
          
          {renderItem()}
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleNextItem}
              disabled={selectedOption === null}
            >
              {currentItemIndex < visualItems.length - 1 ? "Next" : "Complete Test"}
            </Button>
          </div>
        </div>
      )}
    </TestContainer>
  );
};

export default VisualProcessingTest;
