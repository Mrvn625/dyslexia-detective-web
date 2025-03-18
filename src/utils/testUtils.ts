
import { TestResult } from "../data/cognitiveTestsData";

export const saveTestResult = (result: TestResult): void => {
  try {
    // Get existing results from localStorage
    const savedResultsString = localStorage.getItem("testResults");
    const savedResults = savedResultsString ? JSON.parse(savedResultsString) : [];
    
    // Check if there's an existing result for this test
    const existingIndex = savedResults.findIndex((r: TestResult) => r.testId === result.testId);
    
    if (existingIndex >= 0) {
      // Update existing result
      savedResults[existingIndex] = result;
    } else {
      // Add new result
      savedResults.push(result);
    }
    
    // Save back to localStorage
    localStorage.setItem("testResults", JSON.stringify(savedResults));
  } catch (error) {
    console.error("Error saving test result:", error);
  }
};

export const getTestResults = (): TestResult[] => {
  try {
    const savedResultsString = localStorage.getItem("testResults");
    return savedResultsString ? JSON.parse(savedResultsString) : [];
  } catch (error) {
    console.error("Error retrieving test results:", error);
    return [];
  }
};

export const getTestResult = (testId: string): TestResult | null => {
  try {
    const results = getTestResults();
    return results.find(result => result.testId === testId) || null;
  } catch (error) {
    console.error(`Error retrieving result for test ${testId}:`, error);
    return null;
  }
};

export const calculateAverageScore = (results: TestResult[]): number => {
  if (results.length === 0) return 0;
  
  const sum = results.reduce((total, result) => total + result.score, 0);
  return Math.round(sum / results.length);
};

export const calculateDyslexiaRiskScore = (results: TestResult[]): { 
  score: number; 
  level: "Low" | "Moderate" | "High";
  areas: string[];
} => {
  // If no results, return default values
  if (results.length === 0) {
    return { score: 0, level: "Low", areas: [] };
  }
  
  // Calculate the risk score based on test results
  // Define weights for each test type based on research-backed significance
  const weights: Record<string, number> = {
    "rapid-naming": 0.25,         // Highly predictive of dyslexia
    "phonemic-awareness": 0.25,   // Core deficit in dyslexia
    "working-memory": 0.15,       // Important but less specific
    "visual-processing": 0.15,    // Important but less specific
    "processing-speed": 0.1,      // Supportive indicator
    "sequencing": 0.1             // Supportive indicator
  };
  
  // Calculate weighted average score (0-100)
  let weightedScore = 0;
  let totalWeight = 0;
  
  results.forEach(result => {
    const weight = weights[result.testId] || 0.1; // Default weight if not specified
    weightedScore += (100 - result.score) * weight; // Invert score (lower score = higher risk)
    totalWeight += weight;
  });
  
  // Normalize weighted score if we don't have all tests
  const riskScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  
  // Determine risk level
  let riskLevel: "Low" | "Moderate" | "High";
  if (riskScore >= 70) {
    riskLevel = "High";
  } else if (riskScore >= 40) {
    riskLevel = "Moderate";
  } else {
    riskLevel = "Low";
  }
  
  // Identify areas of concern (tests with scores below 60)
  const concernAreas = results
    .filter(result => result.score < 60)
    .map(result => result.testId);
  
  return {
    score: riskScore,
    level: riskLevel,
    areas: concernAreas
  };
};

// Helper to format time in seconds to mm:ss
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper for getting readable test names
export const getTestName = (testId: string): string => {
  const testNames: Record<string, string> = {
    "rapid-naming": "Rapid Naming",
    "phonemic-awareness": "Phonemic Awareness",
    "working-memory": "Working Memory",
    "visual-processing": "Visual Processing",
    "processing-speed": "Processing Speed",
    "sequencing": "Sequencing Ability"
  };
  
  return testNames[testId] || testId;
};

// Generate recommendations based on test results
export const generateRecommendations = (results: TestResult[]): string[] => {
  const recommendations: string[] = [];
  const riskAnalysis = calculateDyslexiaRiskScore(results);
  
  // General recommendations based on risk level
  if (riskAnalysis.level === "High") {
    recommendations.push("Consider a formal assessment by an educational psychologist or dyslexia specialist.");
    recommendations.push("Explore structured literacy programs specifically designed for dyslexia.");
  }
  
  if (riskAnalysis.level === "Moderate" || riskAnalysis.level === "High") {
    recommendations.push("Regular practice with phonics and reading fluency exercises may be beneficial.");
    recommendations.push("Consider assistive technologies such as text-to-speech software for reading support.");
  }
  
  // Specific recommendations based on low-scoring areas
  riskAnalysis.areas.forEach(area => {
    switch (area) {
      case "rapid-naming":
        recommendations.push("Practice quick naming exercises with flashcards to improve naming speed.");
        break;
      case "phonemic-awareness":
        recommendations.push("Focus on phonological awareness activities like rhyming, sound blending, and segmentation.");
        break;
      case "working-memory":
        recommendations.push("Incorporate memory games and sequential tasks into daily activities.");
        break;
      case "visual-processing":
        recommendations.push("Use color coding and visual organizers to support reading and writing.");
        break;
      case "processing-speed":
        recommendations.push("Break tasks into smaller steps and allow additional time for completion.");
        break;
      case "sequencing":
        recommendations.push("Practice activities that involve ordering and sequencing, such as storytelling or step-by-step instructions.");
        break;
    }
  });
  
  // Add general educational support recommendations
  recommendations.push("Regular reading practice with appropriate level texts is essential for improvement.");
  recommendations.push("A multisensory approach to learning that engages multiple senses can enhance retention.");
  
  return recommendations;
};
