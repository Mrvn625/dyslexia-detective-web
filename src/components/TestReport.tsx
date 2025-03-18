
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult } from "@/data/cognitiveTestsData";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";

const TestReport: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load test results and user profile from localStorage
  useEffect(() => {
    const resultsJson = localStorage.getItem("testResults");
    const userJson = localStorage.getItem("userProfile");
    
    if (resultsJson) {
      try {
        setTestResults(JSON.parse(resultsJson));
      } catch (e) {
        console.error("Failed to parse test results", e);
      }
    }
    
    if (userJson) {
      try {
        setUserProfile(JSON.parse(userJson));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const generatePdfReport = () => {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 150);
    doc.text("Dyslexia Assessment Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;
    
    // Add user information if available
    if (userProfile) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("User Information", 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.text(`Name: ${userProfile.name || "Not provided"}`, 20, yPos);
      yPos += 6;
      doc.text(`Age: ${userProfile.age || "Not provided"}`, 20, yPos);
      yPos += 6;
      doc.text(`Gender: ${userProfile.gender || "Not provided"}`, 20, yPos);
      yPos += 6;
      doc.text(`Education Level: ${userProfile.education || "Not provided"}`, 20, yPos);
      yPos += 15;
    }
    
    // Add test results summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Assessment Results Summary", 20, yPos);
    yPos += 10;
    
    if (testResults.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("No test results available.", 20, yPos);
      yPos += 10;
    } else {
      // Table header
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(0, 0, 150);
      doc.rect(20, yPos - 5, pageWidth - 40, 7, "F");
      doc.text("Test", 22, yPos);
      doc.text("Score", pageWidth - 75, yPos);
      doc.text("Completed On", pageWidth - 45, yPos);
      yPos += 7;
      
      // Table rows
      doc.setTextColor(0, 0, 0);
      let isGray = false;
      
      testResults.forEach(result => {
        // Alternate row background
        if (isGray) {
          doc.setFillColor(240, 240, 240);
          doc.rect(20, yPos - 5, pageWidth - 40, 7, "F");
        }
        isGray = !isGray;
        
        // Get test name from ID
        let testName = "";
        switch (result.testId) {
          case "rapid-naming": testName = "Rapid Naming"; break;
          case "phonemic-awareness": testName = "Phonemic Awareness"; break;
          case "working-memory": testName = "Working Memory"; break;
          case "visual-processing": testName = "Visual Processing"; break;
          case "processing-speed": testName = "Processing Speed"; break;
          case "sequencing": testName = "Sequencing Ability"; break;
          default: testName = result.testId;
        }
        
        // Format date
        const date = new Date(result.completedAt);
        const dateStr = date.toLocaleDateString();
        
        doc.text(testName, 22, yPos);
        doc.text(`${result.score}%`, pageWidth - 75, yPos);
        doc.text(dateStr, pageWidth - 45, yPos);
        yPos += 7;
      });
      
      yPos += 10;
    }
    
    // Overall analysis
    if (testResults.length > 0) {
      // Add new page if we're too far down
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Overall Analysis", 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      
      // Calculate average score
      const avgScore = testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length;
      let riskLevel = "";
      
      if (avgScore < 40) {
        riskLevel = "High";
        doc.text("Risk Level: High", 20, yPos);
        yPos += 6;
        doc.text("The test results indicate a high likelihood of dyslexia or related learning difficulties.", 20, yPos);
      } else if (avgScore < 70) {
        riskLevel = "Moderate";
        doc.text("Risk Level: Moderate", 20, yPos);
        yPos += 6;
        doc.text("The test results indicate some characteristics associated with dyslexia or related learning difficulties.", 20, yPos);
      } else {
        riskLevel = "Low";
        doc.text("Risk Level: Low", 20, yPos);
        yPos += 6;
        doc.text("The test results indicate minimal characteristics associated with dyslexia.", 20, yPos);
      }
      
      yPos += 10;
      
      // Recommendations
      doc.setFontSize(14);
      doc.text("Recommendations", 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      if (riskLevel === "High") {
        doc.text("1. Comprehensive assessment by an educational psychologist is strongly recommended.", 20, yPos);
        yPos += 6;
        doc.text("2. Consider educational accommodations such as extended time for assignments and tests.", 20, yPos);
        yPos += 6;
        doc.text("3. Explore structured literacy programs specifically designed for dyslexia.", 20, yPos);
      } else if (riskLevel === "Moderate") {
        doc.text("1. Consider a follow-up assessment with an educational specialist.", 20, yPos);
        yPos += 6;
        doc.text("2. Monitor academic progress and provide support in challenging areas.", 20, yPos);
        yPos += 6;
        doc.text("3. Consider reading and writing support techniques that benefit learners with dyslexia.", 20, yPos);
      } else {
        doc.text("1. Continue to monitor academic progress.", 20, yPos);
        yPos += 6;
        doc.text("2. If concerns persist despite these results, consider a comprehensive educational assessment.", 20, yPos);
      }
      
      yPos += 15;
    }
    
    // Disclaimer
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("DISCLAIMER", 20, yPos);
    yPos += 4;
    doc.text("This report is generated based on screening assessments and should not be considered a clinical diagnosis.", 20, yPos);
    yPos += 4;
    doc.text("For a formal diagnosis of dyslexia or other learning difficulties, please consult with a qualified educational", 20, yPos);
    yPos += 4;
    doc.text("psychologist or specialist. This tool is designed to help identify potential risk factors only.", 20, yPos);
    
    // Save the PDF file
    try {
      doc.save("dyslexia_assessment_report.pdf");
      toast({
        title: "Report downloaded",
        description: "Your assessment report has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating report",
        description: "There was a problem creating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadCSVReport = () => {
    if (testResults.length === 0) {
      toast({
        title: "No data available",
        description: "Complete at least one test to generate a report.",
        variant: "destructive",
      });
      return;
    }
    
    // Create CSV content
    let csvContent = "Test,Score,Completed Date,Time Spent (seconds)\n";
    
    testResults.forEach(result => {
      let testName = "";
      switch (result.testId) {
        case "rapid-naming": testName = "Rapid Naming"; break;
        case "phonemic-awareness": testName = "Phonemic Awareness"; break;
        case "working-memory": testName = "Working Memory"; break;
        case "visual-processing": testName = "Visual Processing"; break;
        case "processing-speed": testName = "Processing Speed"; break;
        case "sequencing": testName = "Sequencing Ability"; break;
        default: testName = result.testId;
      }
      
      const date = new Date(result.completedAt).toLocaleDateString();
      csvContent += `"${testName}",${result.score},"${date}",${result.timeSpent}\n`;
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, "dyslexia_assessment_data.csv");
    
    toast({
      title: "CSV data downloaded",
      description: "Your assessment data has been exported as a CSV file.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Assessment Report</h1>
      
      <Card className="max-w-3xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Generate Your Report</CardTitle>
          <CardDescription>
            Download a comprehensive report of your assessment results for personal use or to share with education professionals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-6">
              <p className="mb-4 text-gray-600">You haven't completed any tests yet.</p>
              <Button onClick={() => navigate("/cognitive-tests")}>
                Go to Tests
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2">Report Summary</h3>
                <p className="text-sm text-gray-600 mb-2">
                  This report includes results from {testResults.length} completed test{testResults.length !== 1 ? 's' : ''}.
                </p>
                <p className="text-sm text-gray-600">
                  Average score: {Math.round(testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length)}%
                </p>
              </div>
              
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <Button 
                  className="flex-1"
                  onClick={generatePdfReport}
                >
                  Download Professional PDF Report
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={downloadCSVReport}
                >
                  Export Data as CSV
                </Button>
              </div>
              
              <p className="mt-4 text-xs text-gray-500 text-center">
                Note: This report is for informational purposes only and does not constitute a clinical diagnosis.
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button variant="outline" onClick={() => navigate("/results")}>
          Back to Results
        </Button>
      </div>
    </div>
  );
};

export default TestReport;
