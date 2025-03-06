
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests, rapidNamingItems } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";

const RapidNamingTest: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testItems, setTestItems] = useState<any[]>([]);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
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
  }, [testItem]);

  const startRecording = () => {
    toast({
      title: "Recording started",
      description: "Name each image out loud as quickly as you can",
    });
    
    setIsRecording(true);
    setTestStartTime(Date.now());
    
    // In a real implementation, we would use the Web Speech API
    // or another recording mechanism
    
    // For now, we'll simulate with a timer
    timerRef.current = setTimeout(() => {
      completeTest();
    }, 20000); // 20 seconds for demo purposes
  };
  
  const completeTest = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setIsRecording(false);
    
    if (testStartTime) {
      const timeSpent = (Date.now() - testStartTime) / 1000; // in seconds
      
      // Calculate items per second (measure of naming speed)
      const itemsPerSecond = testItems.length / timeSpent;
      
      // Save test result
      saveTestResult({
        testId: "rapid-naming",
        score: itemsPerSecond * 10, // Scale for easier interpretation
        timeSpent,
        completedAt: new Date().toISOString(),
        responses: [] // No item-by-item responses for this test
      });
      
      toast({
        title: "Test completed",
        description: `You named ${testItems.length} items in ${timeSpent.toFixed(1)} seconds`,
      });
      
      onComplete();
    }
  };
  
  const handleCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
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
      timeRemaining={isRecording ? 20 : undefined} // Fixed at 20 seconds for demo
    >
      {isRecording ? (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {testItems.slice(0, 20).map((item, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-md transition-all duration-300 ${
                  index === currentItemIndex ? "ring-2 ring-blue-500 scale-110" : ""
                }`}
              >
                <img 
                  src={`/images/naming-test/${item.id}.png`} 
                  alt={item.id}
                  className="w-16 h-16 object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    console.log(`Failed to load image: ${item.id}`);
                  }}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentItemIndex(prev => 
                prev < testItems.length - 1 ? prev + 1 : prev
              )}
              className="mr-2"
            >
              Next Item
            </Button>
            <Button onClick={completeTest}>
              Finish Test
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="mb-6">
            You will see a series of images that you need to name quickly. 
            The test will measure how fast you can name familiar objects.
          </p>
          <Button onClick={startRecording}>
            Start Recording
          </Button>
        </div>
      )}
    </TestContainer>
  );
};

export default RapidNamingTest;
