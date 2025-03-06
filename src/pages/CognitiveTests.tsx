
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CognitiveTests = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartTest = (testId: string) => {
    setSelectedTest(testId);
    toast({
      title: "Test starting",
      description: "This test module is under development and will be available soon.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Cognitive Tests</h1>
      
      <div className="mb-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Cognitive Assessments</CardTitle>
            <CardDescription>
              These tests measure specific cognitive skills related to dyslexia. Complete each test to gather comprehensive assessment data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Each test focuses on a different cognitive area that may be affected in individuals with dyslexia. 
              The tests are designed to be engaging while providing valuable assessment data.
            </p>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These tests are currently under development and will be available soon. 
                You can explore the test descriptions below to learn what will be included.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Rapid Naming Test</CardTitle>
            <CardDescription>Tests ability to quickly name familiar objects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This test measures how quickly you can name familiar items when they appear on screen. 
              Difficulty with rapid naming is a common indicator of dyslexia.
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> 3-5 minutes<br />
              <strong>Format:</strong> Timed identification of objects, colors, or letters
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStartTest("rapid-naming")}>
              Start Test
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phonemic Awareness</CardTitle>
            <CardDescription>Tests sound processing abilities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This test evaluates your ability to identify, segment, and manipulate individual sounds in words,
              which is a foundational skill for reading development.
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> 5-7 minutes<br />
              <strong>Format:</strong> Audio-based exercises with interactive responses
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStartTest("phonemic-awareness")}>
              Start Test
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Working Memory Test</CardTitle>
            <CardDescription>Tests short-term information retention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This test measures how well you can hold and manipulate information in your mind over short periods,
              which is crucial for reading comprehension and following instructions.
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> 4-6 minutes<br />
              <strong>Format:</strong> Sequence recall and pattern matching exercises
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStartTest("working-memory")}>
              Start Test
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual Processing</CardTitle>
            <CardDescription>Tests visual discrimination and processing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This test evaluates how efficiently you can process visual information, including
              symbol recognition and visual discrimination between similar shapes.
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> 3-5 minutes<br />
              <strong>Format:</strong> Pattern recognition and symbol matching
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStartTest("visual-processing")}>
              Start Test
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Speed</CardTitle>
            <CardDescription>Tests speed of information processing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This test measures how quickly you can process and respond to information,
              which affects reading fluency and overall learning efficiency.
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> 5 minutes<br />
              <strong>Format:</strong> Timed response tasks with increasing complexity
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStartTest("processing-speed")}>
              Start Test
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sequencing Ability</CardTitle>
            <CardDescription>Tests sequential ordering abilities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This test evaluates your ability to recognize, remember, and work with sequences,
              which is important for literacy skills and following multi-step instructions.
            </p>
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm">
              <strong>Time:</strong> 4-6 minutes<br />
              <strong>Format:</strong> Pattern completion and sequence arrangement tasks
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleStartTest("sequencing")}>
              Start Test
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate("/results")}
          variant="outline"
          className="mx-auto"
        >
          Skip to Results
        </Button>
      </div>
    </div>
  );
};

export default CognitiveTests;
