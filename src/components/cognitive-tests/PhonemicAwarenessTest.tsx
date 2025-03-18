
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests, phonemicAwarenessItems } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";

const PhonemicAwarenessTest: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [testStartTime, setTestStartTime] = useState<number>(Date.now());
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: string; isCorrect: boolean; timeSpent: number }>>([]); 
  const [testInProgress, setTestInProgress] = useState(false);
  const { toast } = useToast();
  
  const test = cognitiveTests.find(test => test.id === "phonemic-awareness")!;
  const testQuestions = phonemicAwarenessItems;
  const currentQuestion = testQuestions[currentQuestionIndex];
  
  useEffect(() => {
    if (testInProgress) {
      setTestStartTime(Date.now());
    }
  }, [currentQuestionIndex, testInProgress]);

  const startTest = () => {
    setTestInProgress(true);
    setTestStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };
  
  const handleSelectAnswer = (value: string) => {
    setSelectedAnswer(value);
  };
  
  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You need to select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    const timeSpent = (Date.now() - testStartTime) / 1000;
    const isCorrect = selectedAnswer === currentQuestion.content.correctResponse;
    
    // Record answer
    setAnswers(prev => [
      ...prev, 
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        isCorrect,
        timeSpent
      }
    ]);
    
    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Great job! Moving to the next question." 
        : `The correct answer was: ${currentQuestion.content.correctResponse}`,
      variant: isCorrect ? "default" : "destructive"
    });
    
    // Move to next question or complete test
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      completeTest();
    }
  };
  
  const completeTest = () => {
    if (!testInProgress) return;
    
    const timeSpent = (Date.now() - testStartTime) / 1000;
    
    // Record final answer if not already recorded
    if (selectedAnswer && answers.length < testQuestions.length) {
      const isCorrect = selectedAnswer === currentQuestion.content.correctResponse;
      answers.push({
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        isCorrect,
        timeSpent
      });
    }
    
    // Calculate score based on correct answers (0-100 scale)
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / testQuestions.length) * 100);
    
    // Save test result
    saveTestResult({
      testId: "phonemic-awareness",
      score,
      timeSpent,
      completedAt: new Date().toISOString(),
      responses: answers
    });
    
    toast({
      title: "Test completed",
      description: `Your score: ${score}% (${correctAnswers} of ${testQuestions.length} correct)`,
    });
    
    setTestInProgress(false);
    onComplete();
  };
  
  return (
    <TestContainer
      test={test}
      currentStep={currentQuestionIndex + 1}
      totalSteps={testQuestions.length}
      onComplete={completeTest}
      onCancel={onCancel}
      showTimer={testInProgress}
    >
      {!testInProgress ? (
        <div className="text-center py-6">
          <p className="mb-4">
            This test evaluates your phonemic awareness - the ability to identify and manipulate 
            individual sounds (phonemes) in spoken words.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Research shows that phonemic awareness is a strong predictor of reading success and 
            is often an area of difficulty for individuals with dyslexia.
          </p>
          <Button onClick={startTest}>
            Start Test
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.content.question}</h3>
            
            <RadioGroup value={selectedAnswer || ""} onValueChange={handleSelectAnswer}>
              {currentQuestion.content.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex < testQuestions.length - 1 ? "Next Question" : "Complete Test"}
            </Button>
          </div>
        </div>
      )}
    </TestContainer>
  );
};

export default PhonemicAwarenessTest;
