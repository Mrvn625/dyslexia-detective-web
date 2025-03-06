
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cognitiveTests } from "@/data/cognitiveTestsData";

interface TestSelectorProps {
  onSelectTest: (testId: string) => void;
}

const TestSelector: React.FC<TestSelectorProps> = ({ onSelectTest }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      {cognitiveTests.map((test) => (
        <Card key={test.id}>
          <CardHeader>
            <CardTitle>{test.title}</CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {test.instructions}
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> {test.duration}<br />
              <strong>Complexity:</strong> {test.complexity.charAt(0).toUpperCase() + test.complexity.slice(1)}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => onSelectTest(test.id)}
            >
              Start Test
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestSelector;
