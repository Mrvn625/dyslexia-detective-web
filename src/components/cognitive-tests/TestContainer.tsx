
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";
import { CognitiveTest } from "@/data/cognitiveTestsData";
import { useToast } from "@/hooks/use-toast";

interface TestContainerProps {
  test: CognitiveTest;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onComplete: () => void;
  onCancel: () => void;
  timeRemaining?: number;
  showTimer?: boolean;
}

const TestContainer: React.FC<TestContainerProps> = ({
  test,
  children,
  currentStep,
  totalSteps,
  onComplete,
  onCancel,
  timeRemaining,
  showTimer = false,
}) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Add effect to handle timer warnings
  useEffect(() => {
    if (showTimer && timeRemaining !== undefined) {
      if (timeRemaining === 30) {
        toast({
          title: "Time Warning",
          description: "30 seconds remaining for this test.",
        });
      } else if (timeRemaining === 10) {
        toast({
          title: "Time Alert",
          description: "Only 10 seconds left!",
          variant: "destructive",
        });
      }
    }
  }, [timeRemaining, showTimer, toast]);
  
  const handleBeginTest = () => {
    try {
      setShowInstructions(false);
      toast({
        title: "Test Started",
        description: `Beginning the ${test.title} test.`,
      });
    } catch (e) {
      console.error("Error starting test:", e);
      setError("Could not start the test. Please try again.");
      toast({
        title: "Error",
        description: "There was a problem starting the test.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{test.title}</span>
          {showTimer && timeRemaining !== undefined && (
            <span className={`text-lg font-mono px-3 py-1 rounded-md ${
              timeRemaining <= 10 ? 'bg-red-100 text-red-800' : 
              timeRemaining <= 30 ? 'bg-amber-100 text-amber-800' : 
              'bg-slate-100'
            }`}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          )}
        </CardTitle>
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {showInstructions ? (
          <div className="space-y-4">
            <p className="text-gray-600">{test.description}</p>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {test.instructions}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={handleBeginTest}>
                Begin Test
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      {!showInstructions && !error && (
        <>
          <CardContent>
            {children}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel Test
            </Button>
            {currentStep === totalSteps && (
              <Button onClick={onComplete}>
                Complete Test
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TestContainer;
