
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";
import { saveTestResultToServer } from "@/services/api";

// Age-appropriate memory sequences
const getAgeAppropriateSequences = (age: number) => {
  if (age < 7) { // Young children
    return [
      { digits: [3, 1, 7], difficulty: 1 },
      { digits: [6, 1, 5, 2], difficulty: 2 },
      { digits: [8, 3, 5, 7, 1], difficulty: 3 }
    ];
  } else if (age < 12) { // School-age children
    return [
      { digits: [3, 1, 7, 9], difficulty: 1 },
      { digits: [6, 1, 5, 8, 2], difficulty: 2 },
      { digits: [8, 3, 5, 7, 9, 1], difficulty: 3 }
    ];
  } else { // Teens and adults
    return [
      { digits: [3, 1, 7, 9, 2], difficulty: 1 },
      { digits: [6, 1, 5, 8, 2, 4], difficulty: 2 },
      { digits: [8, 3, 5, 7, 9, 1, 4], difficulty: 3 }
    ];
  }
};

// Research-based thresholds for different age groups
const getAgeBasedThresholds = (age: number) => {
  if (age < 7) return { low: 2, medium: 3, high: 4 }; // Young children
  if (age < 12) return { low: 3, medium: 4, high: 5 }; // School-age children
  return { low: 4, medium: 5, high: 6 }; // Teens and adults
};

const WorkingMemoryTest: React.FC<{ 
  onComplete: () => void; 
  onCancel: () => void; 
  userAge?: number;
  onNext?: () => void;
}> = ({ 
  onComplete, 
  onCancel,
  userAge = 30,
  onNext
}) => {
  const [testPhase, setTestPhase] = useState<"instructions" | "presentation" | "recall" | "feedback" | "results">("instructions");
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [results, setResults] = useState<Array<{ sequence: number[]; userInput: number[]; isCorrect: boolean; difficulty: number; responseTime?: number }>>([]);
  const [showDigit, setShowDigit] = useState(false);
  const [recallStartTime, setRecallStartTime] = useState<number>(0);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [memorySequences, setMemorySequences] = useState<Array<{ digits: number[]; difficulty: number }>>([]);
  
  const { toast } = useToast();
  const test = cognitiveTests.find(test => test.id === "working-memory")!;
  
  // Track timers with proper cleanup
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Update sequences when user age changes
  useEffect(() => {
    setMemorySequences(getAgeAppropriateSequences(userAge || 30));
  }, [userAge]);
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const startTest = () => {
    setTestPhase("presentation");
    setTestStartTime(Date.now());
    setCurrentSequenceIndex(0);
    setCurrentDigitIndex(0);
    setResults([]);
    setIsTestRunning(true);
    
    // Start the digit presentation with a delay
    clearTimer();
    timerRef.current = setTimeout(() => showNextDigit(), 1000);
  };
  
  const showNextDigit = () => {
    if (!isTestRunning || currentSequenceIndex >= memorySequences.length) return;
    
    const currentSequence = memorySequences[currentSequenceIndex];
    
    if (currentDigitIndex < currentSequence.digits.length) {
      // Show current digit
      setShowDigit(true);
      
      // Hide after 1 second
      clearTimer();
      timerRef.current = setTimeout(() => {
        setShowDigit(false);
        
        // Show next digit after 0.5 seconds
        clearTimer();
        timerRef.current = setTimeout(() => {
          setCurrentDigitIndex(prev => prev + 1);
          
          if (currentDigitIndex + 1 < currentSequence.digits.length) {
            showNextDigit();
          } else {
            // All digits shown, move to recall phase
            setTestPhase("recall");
            setUserInput([]);
            setRecallStartTime(Date.now());
          }
        }, 500);
      }, 1000);
    }
  };
  
  const handleDigitClick = (digit: number) => {
    if (testPhase === "recall") {
      setUserInput(prev => [...prev, digit]);
    }
  };
  
  const handleBackspace = () => {
    setUserInput(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    if (!memorySequences[currentSequenceIndex]) return;
    
    const currentSequence = memorySequences[currentSequenceIndex];
    
    if (userInput.length !== currentSequence.digits.length) {
      toast({
        title: "Incomplete input",
        description: `Please enter ${currentSequence.digits.length} digits`,
        variant: "destructive"
      });
      return;
    }
    
    const responseTime = (Date.now() - recallStartTime) / 1000;
    
    // Check if sequence was correctly recalled
    const isCorrect = userInput.every((digit, index) => digit === currentSequence.digits[index]);
    
    // Record result
    setResults(prev => [
      ...prev,
      {
        sequence: [...currentSequence.digits],
        userInput: [...userInput],
        isCorrect,
        difficulty: currentSequence.difficulty,
        responseTime
      }
    ]);
    
    // Show feedback
    setTestPhase("feedback");
  };
  
  const handleNextSequence = () => {
    if (currentSequenceIndex < memorySequences.length - 1) {
      // Move to next sequence
      setCurrentSequenceIndex(prev => prev + 1);
      setCurrentDigitIndex(0);
      setTestPhase("presentation");
      
      // Start showing digits for next sequence after a delay
      clearTimer();
      timerRef.current = setTimeout(() => showNextDigit(), 1000);
    } else {
      // Test is complete
      completeTest();
    }
  };
  
  const completeTest = () => {
    setIsTestRunning(false);
    clearTimer();
    
    const timeSpent = (Date.now() - testStartTime) / 1000;
    
    // Calculate score
    const correctSequences = results.filter(r => r.isCorrect).length;
    const maxCorrectDifficulty = results.filter(r => r.isCorrect).reduce((max, r) => Math.max(max, r.difficulty), 0);
    
    // Calculate average response time for correct recalls
    const avgResponseTime = results
      .filter(r => r.isCorrect && r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / (correctSequences || 1);
    
    // Calculate score (weighting: accuracy 60%, difficulty 30%, speed 10%)
    const percentageCorrect = (correctSequences / memorySequences.length) * 100;
    const difficultyScore = (maxCorrectDifficulty / 3) * 100; // 3 is max difficulty
    const speedScore = Math.max(0, 100 - (avgResponseTime * 5));
    
    const score = Math.round((percentageCorrect * 0.6) + (difficultyScore * 0.3) + (speedScore * 0.1));
    
    // Get interpretation based on thresholds
    const thresholds = getAgeBasedThresholds(userAge || 30);
    let interpretation = "";
    if (maxCorrectDifficulty >= thresholds.high) {
      interpretation = "Above average working memory capacity";
    } else if (maxCorrectDifficulty >= thresholds.medium) {
      interpretation = "Average working memory capacity";
    } else if (maxCorrectDifficulty >= thresholds.low) {
      interpretation = "Below average working memory capacity";
    } else {
      interpretation = "Significantly below average working memory capacity";
    }
    
    // Create result object
    const testResult = {
      testId: "working-memory",
      score,
      timeSpent,
      completedAt: new Date().toISOString(),
      responses: results,
      interpretation,
      maxSpan: maxCorrectDifficulty
    };
    
    // Save results
    saveTestResult(testResult);
    
    // Save to server if user is logged in
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        saveTestResultToServer(testResult, userId)
          .catch(err => console.error("Error saving test result to server:", err));
      }
    } catch (error) {
      console.error("Error saving to server:", error);
    }
    
    toast({
      title: "Test completed",
      description: `Your score: ${score}% (${correctSequences} of ${memorySequences.length} sequences correct)`,
    });
    
    setTestPhase("results");
  };
  
  const renderDigitPad = () => {
    return (
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <button
            key={digit}
            className="bg-white border rounded-md p-4 text-2xl font-bold hover:bg-gray-100 active:bg-gray-200"
            onClick={() => handleDigitClick(digit)}
          >
            {digit}
          </button>
        ))}
        <button
          className="bg-white border rounded-md p-4 text-sm font-medium col-span-2 hover:bg-gray-100 active:bg-gray-200"
          onClick={() => handleDigitClick(0)}
        >
          0
        </button>
        <button
          className="bg-white border rounded-md p-4 text-sm font-medium hover:bg-gray-100 active:bg-gray-200"
          onClick={handleBackspace}
        >
          ←
        </button>
      </div>
    );
  };
  
  // Placeholder for ML model integration
  // This is where you would add your CNN and SVM models
  // Example:
  // const analyzePerformance = (responses: any[]) => {
  //   // Load your pre-trained model
  //   // const model = await tf.loadLayersModel('/path/to/cnn-model/model.json');
  //   // const svmModel = await tf.loadLayersModel('/path/to/svm-model/model.json');
  //   
  //   // Prepare input data from user responses
  //   // const inputTensor = tf.tensor(prepareDataForModel(responses));
  //   
  //   // Run prediction
  //   // const prediction = model.predict(inputTensor);
  //   
  //   // Return results
  //   // return prediction;
  // };
  
  return (
    <TestContainer
      test={test}
      currentStep={currentSequenceIndex + 1}
      totalSteps={memorySequences.length}
      onComplete={completeTest}
      onCancel={() => {
        clearTimer();
        setIsTestRunning(false);
        onCancel();
      }}
    >
      {testPhase === "instructions" && (
        <div className="text-center py-6">
          <p className="mb-4">
            This test evaluates your working memory - the ability to temporarily hold and manipulate information.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            You'll be shown a sequence of digits one at a time. After the sequence is complete, 
            you'll need to recall and input the digits in the exact order they were presented.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Working memory deficits are often associated with dyslexia and other learning differences.
          </p>
          <Button onClick={startTest}>
            Start Test
          </Button>
        </div>
      )}
      
      {testPhase === "presentation" && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="text-sm mb-4">Watch the sequence carefully</div>
          
          <div className="h-40 w-40 flex items-center justify-center border-2 rounded-md bg-slate-50">
            {showDigit && memorySequences[currentSequenceIndex]?.digits ? (
              <span className="text-6xl font-bold">{memorySequences[currentSequenceIndex].digits[currentDigitIndex]}</span>
            ) : (
              <span className="text-sm text-gray-400">Next digit coming...</span>
            )}
          </div>
        </div>
      )}
      
      {testPhase === "recall" && (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center">Enter the sequence in the order it was presented</p>
          
          <div className="flex items-center justify-center border rounded-md p-4 min-h-16 min-w-40 bg-white mb-4">
            <div className="text-3xl font-mono tracking-wide">
              {userInput.join(' ')}
              <span className="animate-pulse ml-1">|</span>
            </div>
          </div>
          
          {renderDigitPad()}
          
          <div className="mt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={!memorySequences[currentSequenceIndex] || userInput.length !== memorySequences[currentSequenceIndex].digits.length}
            >
              Submit Answer
            </Button>
          </div>
        </div>
      )}
      
      {testPhase === "feedback" && (
        <div className="text-center py-6">
          <h3 className="text-xl font-medium mb-4">
            {results[currentSequenceIndex]?.isCorrect ? "Correct!" : "Incorrect"}
          </h3>
          
          <div className="bg-slate-50 p-4 rounded-md max-w-xs mx-auto mb-6">
            <div className="mb-2">
              <span className="font-medium">Correct sequence:</span> {results[currentSequenceIndex]?.sequence.join(' ')}
            </div>
            <div>
              <span className="font-medium">Your input:</span> {results[currentSequenceIndex]?.userInput.join(' ')}
            </div>
            {results[currentSequenceIndex]?.responseTime && (
              <div className="mt-2">
                <span className="font-medium">Response time:</span> {results[currentSequenceIndex]?.responseTime.toFixed(1)}s
              </div>
            )}
          </div>
          
          <Button onClick={handleNextSequence}>
            {currentSequenceIndex < memorySequences.length - 1 ? "Next Sequence" : "Complete Test"}
          </Button>
        </div>
      )}
      
      {testPhase === "results" && (
        <div className="text-center py-6">
          <h3 className="text-xl font-medium mb-2">Working Memory Test Completed</h3>
          <p className="mb-6">Thank you for completing this assessment.</p>
          
          <div className="flex flex-col gap-4 items-center">
            <Button onClick={onComplete}>
              See Your Results
            </Button>
            
            {onNext && (
              <Button variant="outline" onClick={onNext}>
                Continue to Next Test
              </Button>
            )}
          </div>
        </div>
      )}
    </TestContainer>
  );
};

export default WorkingMemoryTest;
