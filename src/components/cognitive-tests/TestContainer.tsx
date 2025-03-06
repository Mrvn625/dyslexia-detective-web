
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CognitiveTest } from "@/data/cognitiveTestsData";

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
  
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{test.title}</span>
          {showTimer && timeRemaining !== undefined && (
            <span className="text-lg font-mono bg-slate-100 px-3 py-1 rounded-md">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          )}
        </CardTitle>
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
              <Button onClick={() => setShowInstructions(false)}>
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
      
      {!showInstructions && (
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
