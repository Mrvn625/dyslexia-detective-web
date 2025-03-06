
import { TestResult } from "../data/cognitiveTestsData";

export const saveTestResult = (result: TestResult): void => {
  try {
    // Get existing results from localStorage
    const savedResultsString = localStorage.getItem("testResults");
    const savedResults = savedResultsString ? JSON.parse(savedResultsString) : [];
    
    // Add new result
    savedResults.push(result);
    
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

export const calculateTestScore = (correctAnswers: number, totalQuestions: number): number => {
  return (correctAnswers / totalQuestions) * 100;
};

// Helper to format time in seconds to mm:ss
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper to create a countdown timer
export const useCountdown = (startTime: number, onComplete: () => void) => {
  // Implementation would use useState and useEffect hooks
  // Omitted for brevity but would handle countdown logic
};
