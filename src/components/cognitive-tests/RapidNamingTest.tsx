
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests, rapidNamingItems } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";

// Define a mapping of item IDs to placeholder images
const imagePlaceholders: Record<string, string> = {
  dog: "https://placehold.co/100x100?text=Dog",
  cat: "https://placehold.co/100x100?text=Cat",
  house: "https://placehold.co/100x100?text=House",
  tree: "https://placehold.co/100x100?text=Tree",
  book: "https://placehold.co/100x100?text=Book",
};

const RapidNamingTest: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testItems, setTestItems] = useState<any[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const test = cognitiveTests.find(test => test.id === "rapid-naming")!;
  const testItem = rapidNamingItems[0]; // Using the first test item for now
  
  useEffect(() => {
    // Generate test items based on the content and repetitions
    if (testItem.content.type === "images") {
      const items = [];
      const { repetitions, randomize } = testItem.content;
      const sourceItems = [...testItem.content.items];
      
      for (let i = 0; i < repetitions; i++) {
        if (randomize) {
          // Shuffle the items for each repetition
          items.push(...sourceItems.sort(() => Math.random() - 0.5));
        } else {
          items.push(...sourceItems);
        }
      }
      
      setTestItems(items);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testItem]);

  const startRecording = () => {
    toast({
      title: "Recording started",
      description: "Name each image out loud as quickly as you can",
    });
    
    setIsRecording(true);
    setTestStartTime(Date.now());
    setCurrentItemIndex(0);
    
    // Start timing the test
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };
  
  const completeTest = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsRecording(false);
    
    if (testStartTime) {
      const timeSpent = (Date.now() - testStartTime) / 1000; // in seconds
      
      // Calculate items per second (measure of naming speed)
      const itemsPerSecond = (currentItemIndex + 1) / timeSpent;
      
      // Calculate normalized score (0-100 scale)
      // Research shows typical naming speeds are 2-3 items per second
      // We'll use a scale where 3 items/sec = 100 points
      const normalizedScore = Math.min(100, Math.round(itemsPerSecond * 33.33));
      
      // Save test result
      saveTestResult({
        testId: "rapid-naming",
        score: normalizedScore,
        timeSpent,
        completedAt: new Date().toISOString(),
        responses: [{ 
          itemsNamed: currentItemIndex + 1,
          totalItems: testItems.length,
          itemsPerSecond: itemsPerSecond.toFixed(2)
        }]
      });
      
      toast({
        title: "Test completed",
        description: `You named ${currentItemIndex + 1} of ${testItems.length} items in ${timeSpent.toFixed(1)} seconds`,
      });
      
      onComplete();
    }
  };
  
  const handleNextItem = () => {
    if (currentItemIndex < testItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      completeTest();
    }
  };
  
  const handleCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    onCancel();
  };
  
  return (
    <TestContainer
      test={test}
      currentStep={1}
      totalSteps={1}
      onComplete={completeTest}
      onCancel={handleCancel}
      showTimer={isRecording}
      timeRemaining={isRecording ? 60 - elapsedTime : undefined} // 60 second max time
    >
      {isRecording ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between w-full items-center mb-2">
              <div className="text-sm font-medium">
                Progress: {currentItemIndex + 1} / {testItems.length}
              </div>
              <div className="text-sm font-medium">
                Time: {elapsedTime}s
              </div>
            </div>
            
            {currentItemIndex < testItems.length && (
              <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-white shadow-sm">
                <div className="text-xl font-medium mb-2">Name this image:</div>
                <img 
                  src={imagePlaceholders[testItems[currentItemIndex].id] || "https://placehold.co/200x200?text=Item"}
                  alt={testItems[currentItemIndex].id}
                  className="w-32 h-32 object-contain mb-4"
                />
                <div className="text-lg font-bold text-gray-500">
                  {/* Normally hidden - shown for demonstration */}
                  ({testItems[currentItemIndex].id})
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mt-6">
            <Button onClick={handleNextItem} className="w-full sm:w-auto px-8">
              {currentItemIndex < testItems.length - 1 ? "Next Item" : "Finish Test"}
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {testItems.slice(0, 20).map((item, index) => (
              <div 
                key={index} 
                className={`p-1 border rounded-md transition-all duration-300 ${
                  index === currentItemIndex ? "ring-2 ring-blue-500 bg-blue-50" : 
                  index < currentItemIndex ? "bg-gray-100 opacity-50" : ""
                }`}
              >
                <img 
                  src={imagePlaceholders[item.id] || "https://placehold.co/80x80?text=Item"}
                  alt={item.id}
                  className="w-10 h-10 object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="mb-6">
            You will see a series of images that you need to name quickly. 
            The test will measure how fast you can name familiar objects.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Research shows that individuals with dyslexia often have difficulty
            with rapid automatic naming, which can affect reading fluency.
          </p>
          <Button onClick={startRecording}>
            Start Test
          </Button>
        </div>
      )}
    </TestContainer>
  );
};

export default RapidNamingTest;
