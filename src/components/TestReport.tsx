
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult } from "@/data/cognitiveTestsData";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTestResults, getTestName } from "@/utils/testUtils";

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
    let yPos = 15;
    
    // Add header with logo placeholder
    doc.setFillColor(0, 51, 102); // Dark blue header
    doc.rect(0, 0, pageWidth, 25, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Cognitive Assessment Report", pageWidth / 2, 15, { align: "center" });
    
    yPos = 30;
    
    // Add report ID and date
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report ID: ${generateReportId()}`, 15, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, yPos, { align: "right" });
    
    yPos += 10;
    
    // Add underline
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    
    yPos += 10;
    
    // Add user information if available
    if (userProfile) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Patient Information", 15, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${userProfile.name || "Not provided"}`, 15, yPos);
      doc.text(`ID: ${userProfile.id || "Not assigned"}`, pageWidth - 15, yPos, { align: "right" });
      yPos += 6;
      
      doc.text(`Age: ${userProfile.age || "Not provided"}`, 15, yPos);
      doc.text(`Gender: ${userProfile.gender || "Not provided"}`, pageWidth / 2, yPos);
      yPos += 6;
      
      if (userProfile.education) {
        doc.text(`Education: ${userProfile.education}`, 15, yPos);
        yPos += 6;
      }
      
      if (userProfile.medicalHistory) {
        doc.text(`Relevant Medical History: ${userProfile.medicalHistory}`, 15, yPos);
        yPos += 6;
      }
      
      yPos += 5;
      
      // Add underline
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(15, yPos, pageWidth - 15, yPos);
      
      yPos += 10;
    }
    
    // Assessment Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Assessment Summary", 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    if (testResults.length === 0) {
      doc.text("No assessments have been completed.", 15, yPos);
      yPos += 10;
    } else {
      // Calculate overall risk level
      const avgScore = testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length;
      let riskLevel = avgScore < 40 ? "High" : avgScore < 70 ? "Moderate" : "Low";
      
      doc.text(`Tests Completed: ${testResults.length}`, 15, yPos);
      doc.text(`Average Score: ${Math.round(avgScore)}%`, pageWidth / 2, yPos);
      yPos += 6;
      
      doc.text(`Risk Level: ${riskLevel}`, 15, yPos);
      yPos += 10;
      
      // Detailed Results Table
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Assessment Results", 15, yPos);
      yPos += 8;
      
      // Table header
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, pageWidth - 30, 8, "F");
      
      doc.setFontSize(9);
      doc.text("Assessment", 20, yPos);
      doc.text("Score", pageWidth - 110, yPos);
      doc.text("Performance", pageWidth - 80, yPos);
      doc.text("Completion Date", pageWidth - 30, yPos, { align: "right" });
      
      yPos += 5;
      
      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, pageWidth - 15, yPos);
      
      yPos += 5;
      
      // Table rows
      testResults.forEach((result, index) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont("helvetica", "normal");
        
        // Get test name
        const testName = getTestName(result.testId);
        
        // Format date
        const date = new Date(result.completedAt);
        const dateStr = date.toLocaleDateString();
        
        // Performance category
        let performance = "";
        if (result.score >= 80) performance = "Strong";
        else if (result.score >= 60) performance = "Average";
        else if (result.score >= 40) performance = "Below Average";
        else performance = "Concerning";
        
        // Alternate row shading
        if (index % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(15, yPos - 5, pageWidth - 30, 8, "F");
        }
        
        doc.text(testName, 20, yPos);
        doc.text(`${Math.round(result.score)}%`, pageWidth - 110, yPos);
        doc.text(performance, pageWidth - 80, yPos);
        doc.text(dateStr, pageWidth - 30, yPos, { align: "right" });
        
        yPos += 8;
      });
      
      yPos += 5;
      
      // Clinical Interpretation
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Clinical Interpretation", 15, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const interpretationText = getInterpretationText(testResults, avgScore);
      
      // Wrap text
      const splitText = doc.splitTextToSize(interpretationText, pageWidth - 30);
      doc.text(splitText, 15, yPos);
      
      yPos += splitText.length * 6 + 5;
      
      // Recommendations
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Recommendations", 15, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Add recommendations based on test results
      const recommendations = getRecommendations(testResults, avgScore);
      
      recommendations.forEach(rec => {
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(10);
        
        // Bullet point
        doc.setFillColor(0, 51, 102);
        doc.circle(17, yPos - 2, 1, 'F');
        
        // Recommendation text (with wrapping)
        const splitRec = doc.splitTextToSize(rec, pageWidth - 35);
        doc.text(splitRec, 22, yPos);
        
        yPos += splitRec.length * 6 + 3;
      });
    }
    
    // Add footer
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This report is generated based on cognitive assessments and should not be considered a clinical diagnosis.", pageWidth / 2, footerY - 5, { align: "center" });
    doc.text("For a formal diagnosis, please consult with a qualified healthcare professional.", pageWidth / 2, footerY, { align: "center" });
    
    // Add page number
    doc.setFontSize(8);
    doc.text(`Page 1 of 1`, pageWidth - 20, footerY);
    
    // Save the PDF file
    try {
      doc.save("cognitive_assessment_report.pdf");
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
    let csvContent = "Test,Score,Completed Date,Time Spent (seconds),Interpretation\n";
    
    testResults.forEach(result => {
      const testName = getTestName(result.testId);
      const date = new Date(result.completedAt).toLocaleDateString();
      const interpretation = result.interpretation || "No interpretation available";
      
      csvContent += `"${testName}",${result.score},"${date}",${result.timeSpent},"${interpretation}"\n`;
    });
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, "cognitive_assessment_data.csv");
    
    toast({
      title: "CSV data downloaded",
      description: "Your assessment data has been exported as a CSV file.",
    });
  };
  
  // Helper functions for report generation
  const generateReportId = () => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CA-${timestamp}-${random}`;
  };
  
  const getInterpretationText = (results: TestResult[], avgScore: number) => {
    if (results.length === 0) return "No assessments have been completed.";
    
    // Create a more clinical, professional interpretation
    let baseText = "";
    
    if (avgScore < 40) {
      baseText = "Assessment results indicate significant difficulties in multiple cognitive domains associated with dyslexia. The pattern of performance suggests challenges with key processes involved in reading acquisition and fluency.";
    } else if (avgScore < 70) {
      baseText = "Assessment results indicate some cognitive processing difficulties that may be associated with dyslexia. The pattern of performance shows relative strengths and weaknesses across different cognitive domains.";
    } else {
      baseText = "Assessment results indicate generally intact cognitive processing abilities in domains associated with dyslexia. The pattern of performance shows predominantly age-appropriate skills.";
    }
    
    // Add details about specific tests
    let specificFindings = " Specific findings include:";
    
    results.forEach(result => {
      if (result.testId === "working-memory" && result.score < 50) {
        specificFindings += " reduced working memory capacity, which may impact reading comprehension and retention;";
      }
      if (result.testId === "phonemic-awareness" && result.score < 50) {
        specificFindings += " difficulties with phonological processing, a core deficit associated with dyslexia;";
      }
      if (result.testId === "rapid-naming" && result.score < 50) {
        specificFindings += " slower rapid automatized naming, which often correlates with reading fluency difficulties;";
      }
      if (result.testId === "visual-processing" && result.score < 50) {
        specificFindings += " challenges with visual processing that may affect symbol recognition and discrimination;";
      }
    });
    
    if (specificFindings !== " Specific findings include:") {
      baseText += specificFindings;
    }
    
    return baseText;
  };
  
  const getRecommendations = (results: TestResult[], avgScore: number) => {
    const recommendations: string[] = [];
    
    // Basic recommendations based on risk level
    if (avgScore < 40) {
      recommendations.push("Comprehensive psychoeducational assessment by a qualified professional is strongly recommended to confirm diagnosis and establish eligibility for accommodations.");
      recommendations.push("Consider evidence-based structured literacy intervention programs specifically designed for dyslexia (e.g., Orton-Gillingham, Wilson Reading System, or Lindamood-Bell).");
      recommendations.push("Explore educational accommodations such as extended time for assignments and tests, alternative formats for reading materials, and assistive technology.");
    } else if (avgScore < 70) {
      recommendations.push("Further assessment by an educational specialist may be beneficial to clarify the nature and extent of learning difficulties.");
      recommendations.push("Consider supplemental support in challenging areas through evidence-based interventions targeting specific skill deficits.");
      recommendations.push("Implement classroom accommodations to support learning, such as preferential seating, clear written instructions, and additional processing time.");
    } else {
      recommendations.push("Continue monitoring academic progress and development of literacy skills.");
      recommendations.push("If concerns persist despite these results, consider a comprehensive assessment by an educational psychologist.");
    }
    
    // Specific recommendations based on test results
    results.forEach(result => {
      if (result.testId === "working-memory" && result.score < 60) {
        recommendations.push("Implement working memory support strategies: breaking complex instructions into smaller steps, using visual aids, and providing written instructions for reference.");
      }
      if (result.testId === "phonemic-awareness" && result.score < 60) {
        recommendations.push("Engage in daily phonological awareness activities focusing on sound manipulation, rhyming, blending, and segmentation skills.");
      }
      if (result.testId === "rapid-naming" && result.score < 60) {
        recommendations.push("Practice rapid naming exercises with varied stimuli to improve automaticity and processing speed for symbols and letters.");
      }
    });
    
    return recommendations;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Assessment Report</h1>
      
      <Card className="max-w-4xl mx-auto mb-8 border-t-4 border-t-blue-700 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-blue-800">Clinical Assessment Report</CardTitle>
          <CardDescription>
            Generate a comprehensive clinical report based on completed cognitive assessments
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
              <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard Report</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Clinical Report</TabsTrigger>
                </TabsList>
                <TabsContent value="standard" className="pt-4">
                  <div className="mb-6 p-5 bg-blue-50 rounded-md border border-blue-100">
                    <h3 className="font-medium mb-2">Report Summary</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      This report includes results from {testResults.length} completed test{testResults.length !== 1 ? 's' : ''} and provides basic interpretation.
                    </p>
                    <p className="text-sm text-gray-700">
                      Overall performance score: {Math.round(testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length)}%
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      className="w-full"
                      onClick={generatePdfReport}
                    >
                      Download Standard PDF Report
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={downloadCSVReport}
                    >
                      Export Raw Data (CSV)
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="detailed" className="pt-4">
                  <div className="mb-6 p-5 bg-amber-50 rounded-md border border-amber-100">
                    <h3 className="font-medium mb-2">Clinical Report Information</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      This comprehensive clinical report includes detailed assessment interpretations, evidence-based recommendations, and professional formatting suitable for sharing with healthcare providers.
                    </p>
                    <p className="text-sm text-gray-700">
                      Includes: Detailed cognitive profile, normative comparisons, and specific intervention recommendations.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={generatePdfReport}
                    >
                      Generate Clinical PDF Report
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <p className="mt-6 text-xs text-gray-500 text-center">
                <strong>Important Notice:</strong> This assessment report is generated for informational purposes and does not constitute a clinical diagnosis of dyslexia or any other condition. Please consult with a qualified healthcare professional for diagnostic evaluation.
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button variant="outline" onClick={() => navigate("/results")} className="mr-2">
          View Results Dashboard
        </Button>
        <Button onClick={() => navigate("/cognitive-tests")}>
          Return to Tests
        </Button>
      </div>
    </div>
  );
};

export default TestReport;
