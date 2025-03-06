
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const HandwritingAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
    
    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Analysis in progress",
        description: "Your handwriting sample is being analyzed. This feature is still under development.",
      });
      setIsSubmitting(false);
    }, 2000);
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
            Handwriting can reveal patterns associated with dyslexia, such as:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Irregular letter sizes and shapes</li>
            <li>Inconsistent spacing between words and letters</li>
            <li>Unusual alignment and positioning on the page</li>
            <li>Letter reversals (b/d, p/q)</li>
            <li>Mixed uppercase and lowercase letters</li>
          </ul>
          <p>
            Upload a clear image of a handwriting sample for our tool to analyze these patterns.
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
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
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Note: This feature is currently under development. Full functionality coming soon.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandwritingAnalysis;
