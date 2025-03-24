
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import { getTestResult } from "@/utils/testUtils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TestSelector: React.FC<{ 
  onSelectTest: (testId: string) => void;
  className?: string;
}> = ({ onSelectTest, className = "" }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSelectTest = (testId: string) => {
    onSelectTest(testId);
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cognitiveTests.map(test => {
          const completedTest = getTestResult(test.id);
          
          return (
            <Card key={test.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{test.title}</span>
                  {completedTest && <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> {test.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">{test.description}</p>
                
                {completedTest && (
                  <div className="mt-4 p-2 bg-gray-50 rounded border text-sm">
                    <div>
                      <span className="font-medium">Last Score:</span> {Math.round(completedTest.score)}/100
                    </div>
                    <div>
                      <span className="font-medium">Completed:</span> {new Date(completedTest.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant={completedTest ? "outline" : "default"} 
                  className="w-full"
                  onClick={() => handleSelectTest(test.id)}
                >
                  {completedTest ? "Retake Test" : "Start Test"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TestSelector;
