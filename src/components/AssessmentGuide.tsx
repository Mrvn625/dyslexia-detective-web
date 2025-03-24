
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAssessmentFlow } from '@/hooks/useAssessmentFlow';

const AssessmentGuide: React.FC = () => {
  const navigate = useNavigate();
  const { steps, currentStepIndex, getNextStep } = useAssessmentFlow();
  const nextStep = getNextStep();
  
  const handleContinue = () => {
    if (nextStep) {
      navigate(nextStep.path);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Assessment Progress</CardTitle>
        <CardDescription>
          Follow these steps to complete your dyslexia assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.path}
              className={`flex items-center p-3 rounded-md ${
                index === currentStepIndex 
                  ? 'bg-blue-50 border border-blue-200' 
                  : step.completed 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === currentStepIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <span className={`font-medium ${
                  index === currentStepIndex ? 'text-blue-700' : step.completed ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < currentStepIndex && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(step.path)}
                  className="ml-auto"
                >
                  Review
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      {nextStep && (
        <CardFooter>
          <Button onClick={handleContinue} className="w-full flex items-center justify-center">
            Continue to {nextStep.label} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AssessmentGuide;
