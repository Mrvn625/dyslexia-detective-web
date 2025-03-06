
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Dyslexia Detective</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive tool to help identify signs of dyslexia through multiple assessment methods.
        </p>
        <div className="mt-8">
          <Link to="/what-is-dyslexia">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              Learn About Dyslexia
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Educational Content</CardTitle>
            <CardDescription>Learn about dyslexia and how our tests work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link to="/what-is-dyslexia" className="block">
                <Button variant="outline" className="w-full">What is Dyslexia</Button>
              </Link>
              <Link to="/how-tests-work" className="block">
                <Button variant="outline" className="w-full">How Tests Work</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Tools</CardTitle>
            <CardDescription>Multiple ways to screen for dyslexia signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link to="/handwriting-analysis" className="block">
                <Button variant="outline" className="w-full">Handwriting Analysis</Button>
              </Link>
              <Link to="/checklist" className="block">
                <Button variant="outline" className="w-full">Symptom Checklist</Button>
              </Link>
              <Link to="/cognitive-tests" className="block">
                <Button variant="outline" className="w-full">Cognitive Tests</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results & Next Steps</CardTitle>
            <CardDescription>Review your assessment and get recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link to="/results" className="block">
                <Button variant="outline" className="w-full">View Results</Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Complete the assessments first to get personalized results and recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
