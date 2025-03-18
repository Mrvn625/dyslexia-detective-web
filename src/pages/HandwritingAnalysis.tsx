
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Note for Model Integration:
// To integrate your Hybrid CNN-SVM model, replace the code in the handleSubmit function
// where it says "// Simulating model prediction" with your model inference code.
// Your model files should be placed in src/models/handwriting/ directory.
// The prediction function would be imported as:
// import { predictDyslexiaFromHandwriting } from "@/models/handwriting/cnn_svm_model";
// And then called with: const prediction = await predictDyslexiaFromHandwriting(imageData);

const HandwritingAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    indicators: string[];
    recommendation: string;
  } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Preview image can be added here if needed
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a handwriting sample to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulating model prediction
    // In a real implementation, this would call your CNN-SVM model
    setTimeout(() => {
      // This is where your model would be called
      // const prediction = await predictDyslexiaFromHandwriting(imageData);
      
      // Mock result until real model is integrated
      const mockResult = {
        score: Math.floor(Math.random() * 100),
        indicators: [
          "Irregular letter spacing",
          "Inconsistent letter size",
          "Letter reversals detected",
          "Unconventional letter formation"
        ],
        recommendation: "Based on the handwriting analysis, we recommend further assessment by an educational psychologist."
      };
      
      setAnalysisResult(mockResult);
      setIsSubmitting(false);
      
      toast({
        title: "Analysis complete",
        description: "Your handwriting sample has been analyzed.",
      });
    }, 2000);
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    // Create report content
    const reportContent = `
      DYSLEXIA HANDWRITING ANALYSIS REPORT
      ===================================
      
      Date: ${new Date().toLocaleDateString()}
      
      ANALYSIS SCORE: ${analysisResult.score}/100
      
      INDICATORS IDENTIFIED:
      ${analysisResult.indicators.map(i => `- ${i}`).join('\n')}
      
      RECOMMENDATION:
      ${analysisResult.recommendation}
      
      NEXT STEPS:
      1. Discuss these results with an educational specialist
      2. Consider a comprehensive dyslexia assessment
      3. Explore support strategies based on identified patterns
      
      Note: This analysis is preliminary and should not replace professional evaluation.
    `;
    
    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'handwriting_analysis_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Handwriting Analysis</h1>
      
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our handwriting analysis uses a hybrid CNN-SVM (Convolutional Neural Network - Support Vector Machine) model to identify patterns associated with dyslexia, such as:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Irregular letter sizes and shapes</li>
            <li>Inconsistent spacing between words and letters</li>
            <li>Unusual alignment and positioning on the page</li>
            <li>Letter reversals (b/d, p/q)</li>
            <li>Mixed uppercase and lowercase letters</li>
          </ul>
          <p>
            Upload a clear image of a handwriting sample for our AI model to analyze these patterns.
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Upload Handwriting Sample</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload handwriting image</Label>
              <Input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-500">
                Acceptable formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Add any details about the handwriting sample (e.g., age of writer, known challenges)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Analyzing..." : "Analyze Handwriting"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-lg mb-2">Dyslexia Indicator Score</h3>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        analysisResult.score > 70 ? 'bg-red-500' : 
                        analysisResult.score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${analysisResult.score}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{analysisResult.score}%</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Indicators Identified</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {analysisResult.indicators.map((indicator, index) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Recommendation</h3>
                <p>{analysisResult.recommendation}</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleDownloadReport}
              >
                Download Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HandwritingAnalysis;
