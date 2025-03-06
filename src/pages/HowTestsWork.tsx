
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const HowTestsWork = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">How Our Dyslexia Tests Work</h1>
      
      <div className="mb-8">
        <p className="text-lg text-center max-w-3xl mx-auto">
          Our platform offers multiple assessment methods to help identify potential signs of dyslexia. 
          Each test focuses on different aspects related to dyslexia.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3">Handwriting Analysis</h2>
            <p className="mb-4">
              This test analyzes handwriting samples for common patterns associated with dyslexia, such as:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Inconsistent letter sizing</li>
              <li>Unusual spacing between words</li>
              <li>Letter reversals or inversions</li>
              <li>Difficulty staying on lines</li>
              <li>Unusual grip or posture when writing</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Upload a handwriting sample or use our digital drawing tool for analysis.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3">Symptom Checklist</h2>
            <p className="mb-4">
              Our comprehensive checklist covers behavioral, academic, and cognitive indicators of dyslexia:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reading difficulties</li>
              <li>Spelling challenges</li>
              <li>Writing issues</li>
              <li>Language processing</li>
              <li>Memory patterns</li>
              <li>Organizational skills</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Answer questions about observed behaviors and challenges to identify potential dyslexia patterns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3">Cognitive Tests</h2>
            <p className="mb-4">
              Interactive exercises that evaluate specific cognitive functions related to dyslexia:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Phonological awareness</li>
              <li>Rapid naming abilities</li>
              <li>Working memory</li>
              <li>Processing speed</li>
              <li>Sequential processing</li>
              <li>Visual discrimination</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Complete timed interactive activities that measure specific cognitive skills.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Important Notes About Our Tests</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Not a Clinical Diagnosis</h3>
              <p>
                These assessments are screening tools designed to identify potential signs of dyslexia. 
                They do not provide a clinical diagnosis, which requires evaluation by qualified professionals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Comprehensive Approach</h3>
              <p>
                Dyslexia is complex and varies from person to person. Using multiple assessment methods 
                provides a more comprehensive picture than any single test.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Next Steps</h3>
              <p>
                If our assessments indicate potential signs of dyslexia, the results page will provide 
                guidance on seeking professional evaluation and potential support resources.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Privacy</h3>
              <p>
                All assessment data is processed locally in your browser. We don't store or share your 
                personal test results. You can download your results for your records or to share with professionals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowTestsWork;
