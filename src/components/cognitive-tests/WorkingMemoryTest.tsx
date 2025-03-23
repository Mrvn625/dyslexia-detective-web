
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";
import { saveTestResultToServer } from "@/services/api";

// Working Memory Test configuration with research-backed thresholds
// Based on research by Baddeley & Hitch (1974) and later updates by Cowan (2001)
const memorySequences = [
  { digits: [3, 1, 7, 9], difficulty: 1 },
  { digits: [6, 1, 5, 8, 2], difficulty: 2 },
  { digits: [8, 3, 5, 7, 9, 1], difficulty: 3 },
  { digits: [2, 5, 1, 7, 3, 9, 4], difficulty: 4 },
  { digits: [9, 1, 7, 4, 2, 8, 6, 3], difficulty: 5 },
];

// Research-based thresholds for different age groups
// Sources: Gathercole et al. (2004), Alloway et al. (2009)
const getAgeBasedThresholds = (age: number) => {
  if (age < 7) return { low: 2, medium: 3, high: 4 }; // Young children
  if (age < 12) return { low: 3, medium: 4, high: 5 }; // School-age children
  if (age < 18) return { low: 4, medium: 5, high: 6 }; // Adolescents
  if (age < 60) return { low: 5, medium: 6, high: 7 }; // Adults
  return { low: 4, medium: 5, high: 6 }; // Older adults
};

const WorkingMemoryTest: React.FC<{ onComplete: () => void; onCancel: () => void; userAge?: number }> = ({ 
  onComplete, 
  onCancel,
  userAge = 30 // Default to adult if no age provided
}) => {
  const [testPhase, setTestPhase] = useState<"instructions" | "presentation" | "recall" | "feedback">("instructions");
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [results, setResults] = useState<Array<{ sequence: number[]; userInput: number[]; isCorrect: boolean; difficulty: number; responseTime?: number }>>([]);
  const [showDigit, setShowDigit] = useState(false);
  const [recallStartTime, setRecallStartTime] = useState<number>(0);
  const [isTestRunning, setIsTestRunning] = useState(false);
  
  const { toast } = useToast();
  
  const test = cognitiveTests.find(test => test.id === "working-memory")!;
  const currentSequence = memorySequences[currentSequenceIndex];
  const thresholds = getAgeBasedThresholds(userAge);
  
  // These refs will track our timers to ensure we can clean them up properly
  const digitTimerRef = useRef<number | null>(null);
  const presentationTimerRef = useRef<number | null>(null);
  
  // Clean up all timers when component unmounts or test changes
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);
  
  // Reset timers when moving to a new sequence or phase changes
  useEffect(() => {
    if (testPhase === "presentation" && isTestRunning) {
      clearAllTimers();
      
      // Small delay before starting presentation to ensure clean state
      const startTimer = window.setTimeout(() => {
        startDigitPresentation();
      }, 500);
      
      return () => window.clearTimeout(startTimer);
    }
  }, [testPhase, currentSequenceIndex, isTestRunning]);
  
  const clearAllTimers = () => {
    if (digitTimerRef.current !== null) {
      window.clearTimeout(digitTimerRef.current);
      digitTimerRef.current = null;
    }
    if (presentationTimerRef.current !== null) {
      window.clearTimeout(presentationTimerRef.current);
      presentationTimerRef.current = null;
    }
  };
  
  const startTest = () => {
    setTestPhase("presentation");
    setTestStartTime(Date.now());
    setCurrentSequenceIndex(0);
    setCurrentDigitIndex(0);
    setResults([]);
    setIsTestRunning(true);
  };
  
  const startDigitPresentation = () => {
    // Safety check to ensure component is still mounted
    if (!isTestRunning) return;
    
    // Show the current digit
    setShowDigit(true);
    
    // Schedule hiding the digit after 1 second
    digitTimerRef.current = window.setTimeout(() => {
      setShowDigit(false);
      
      // Schedule showing the next digit (or moving to recall) after 0.5 seconds
      presentationTimerRef.current = window.setTimeout(() => {
        if (!isTestRunning) return;
        
        const nextDigitIndex = currentDigitIndex + 1;
        
        if (nextDigitIndex < currentSequence.digits.length) {
          // Move to next digit
          setCurrentDigitIndex(nextDigitIndex);
          startDigitPresentation();
        } else {
          // All digits presented, move to recall phase
          setTestPhase("recall");
          setCurrentDigitIndex(0);
          setUserInput([]);
          setRecallStartTime(Date.now());
        }
      }, 500);
    }, 1000);
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
    if (userInput.length !== currentSequence.digits.length) {
      toast({
        title: "Incomplete input",
        description: `Please enter ${currentSequence.digits.length} digits`,
        variant: "destructive"
      });
      return;
    }
    
    const responseTime = (Date.now() - recallStartTime) / 1000; // Calculate response time in seconds
    
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
      setCurrentSequenceIndex(prev => prev + 1);
      setCurrentDigitIndex(0);
      setTestPhase("presentation");
    } else {
      completeTest();
    }
  };
  
  const completeTest = () => {
    setIsTestRunning(false);
    clearAllTimers();
    
    const timeSpent = (Date.now() - testStartTime) / 1000;
    
    // Calculate score based on research-backed metrics
    const correctSequences = results.filter(r => r.isCorrect).length;
    const maxCorrectDifficulty = results.filter(r => r.isCorrect).reduce((max, r) => Math.max(max, r.difficulty), 0);
    
    // Average response time for correct recalls (speed component)
    const avgResponseTime = results
      .filter(r => r.isCorrect && r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / (correctSequences || 1);
    
    // Apply weighting based on research by Alloway & Alloway (2010)
    // Accuracy (60%), Max Difficulty (30%), Speed (10%)
    const percentageCorrect = (correctSequences / memorySequences.length) * 100;
    const difficultyScore = (maxCorrectDifficulty / 5) * 100; // 5 is max difficulty
    const speedScore = Math.max(0, 100 - (avgResponseTime * 5)); // Lower times = higher scores, capped at 100
    
    const score = Math.round((percentageCorrect * 0.6) + (difficultyScore * 0.3) + (speedScore * 0.1));
    
    // Interpretation based on thresholds
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
    
    // Create the result object
    const testResult = {
      testId: "working-memory",
      score,
      timeSpent,
      completedAt: new Date().toISOString(),
      responses: results,
      interpretation,
      maxSpan: maxCorrectDifficulty
    };
    
    // Save test result locally
    saveTestResult(testResult);
    
    // Also save to server if user is logged in (for future implementation)
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
    
    onComplete();
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
  
  return (
    <TestContainer
      test={test}
      currentStep={currentSequenceIndex + 1}
      totalSteps={memorySequences.length}
      onComplete={completeTest}
      onCancel={() => {
        clearAllTimers();
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
            Research shows that working memory capacity is closely related to reading ability
            and is often affected in individuals with dyslexia. According to Baddeley's model of working memory,
            individuals with dyslexia may show deficits in the phonological loop component.
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
            {showDigit ? (
              <span className="text-6xl font-bold">{currentSequence.digits[currentDigitIndex]}</span>
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
            <Button onClick={handleSubmit} disabled={userInput.length !== currentSequence.digits.length}>
              Submit Answer
            </Button>
          </div>
        </div>
      )}
      
      {testPhase === "feedback" && (
        <div className="text-center py-6">
          <h3 className="text-xl font-medium mb-4">
            {results[currentSequenceIndex].isCorrect ? "Correct!" : "Incorrect"}
          </h3>
          
          <div className="bg-slate-50 p-4 rounded-md max-w-xs mx-auto mb-6">
            <div className="mb-2">
              <span className="font-medium">Correct sequence:</span> {results[currentSequenceIndex].sequence.join(' ')}
            </div>
            <div>
              <span className="font-medium">Your input:</span> {results[currentSequenceIndex].userInput.join(' ')}
            </div>
            {results[currentSequenceIndex].responseTime && (
              <div className="mt-2">
                <span className="font-medium">Response time:</span> {results[currentSequenceIndex].responseTime.toFixed(1)}s
              </div>
            )}
          </div>
          
          <Button onClick={handleNextSequence}>
            {currentSequenceIndex < memorySequences.length - 1 ? "Next Sequence" : "Complete Test"}
          </Button>
        </div>
      )}
    </TestContainer>
  );
};

export default WorkingMemoryTest;
