
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TestContainer from "./TestContainer";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";

// Symbols for processing speed test
const symbols = [
  { id: 'circle', symbol: '○' },
  { id: 'square', symbol: '□' },
  { id: 'triangle', symbol: '△' },
  { id: 'star', symbol: '★' },
];

// Test configuration
const processingTests = [
  {
    id: 'ps1',
    type: 'symbolMatching',
    instructions: "Click on all the circles as quickly as you can",
    targetSymbol: 'circle',
    timeLimit: 20, // seconds
    gridSize: 5, // 5x5 grid
    targetCount: 8 // Number of target symbols in the grid
  },
  {
    id: 'ps2',
    type: 'symbolMatching',
    instructions: "Click on all the squares as quickly as you can",
    targetSymbol: 'square',
    timeLimit: 20,
    gridSize: 5,
    targetCount: 8
  },
  {
    id: 'ps3',
    type: 'symbolMatching',
    instructions: "Click on all the triangles as quickly as you can",
    targetSymbol: 'triangle',
    timeLimit: 20,
    gridSize: 6, // 6x6 grid (harder)
    targetCount: 10
  }
];

const ProcessingSpeedTest: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [testState, setTestState] = useState<"instructions" | "testing" | "results">("instructions");
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [grid, setGrid] = useState<Array<{ symbol: string, id: string, clicked: boolean }>>([]);
  const [testStartTime, setTestStartTime] = useState(0);
  const [testResults, setTestResults] = useState<Array<{
    testId: string;
    correctClicks: number;
    incorrectClicks: number;
    targetCount: number;
    missedTargets: number;
    timeSpent: number;
  }>>([]);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [incorrectClicks, setIncorrectClicks] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const test = cognitiveTests.find(test => test.id === "processing-speed")!;
  const currentTest = processingTests[currentTestIndex];
  
  // Generate a random grid of symbols
  const generateGrid = (testConfig: typeof processingTests[0]) => {
    const { gridSize, targetSymbol, targetCount } = testConfig;
    const totalCells = gridSize * gridSize;
    const grid = [];
    
    // Create an array of all possible positions
    const positions = Array.from({ length: totalCells }, (_, i) => i);
    
    // Shuffle the positions array
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
    
    // Select the first n positions for target symbols
    const targetPositions = new Set(shuffledPositions.slice(0, targetCount));
    
    // Fill the grid
    for (let i = 0; i < totalCells; i++) {
      if (targetPositions.has(i)) {
        // This is a target position
        grid.push({
          symbol: symbols.find(s => s.id === targetSymbol)!.symbol,
          id: targetSymbol,
          clicked: false
        });
      } else {
        // This is a non-target position
        // Select a random non-target symbol
        const nonTargetSymbols = symbols.filter(s => s.id !== targetSymbol);
        const randomSymbol = nonTargetSymbols[Math.floor(Math.random() * nonTargetSymbols.length)];
        grid.push({
          symbol: randomSymbol.symbol,
          id: randomSymbol.id,
          clicked: false
        });
      }
    }
    
    return grid;
  };
  
  const startTest = () => {
    const grid = generateGrid(currentTest);
    setGrid(grid);
    setTimeRemaining(currentTest.timeLimit);
    setCorrectClicks(0);
    setIncorrectClicks(0);
    setTestStartTime(Date.now());
    setTestState("testing");
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endCurrentTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleSymbolClick = (index: number) => {
    if (grid[index].clicked) return; // Already clicked
    
    // Update the grid to mark this symbol as clicked
    const newGrid = [...grid];
    newGrid[index] = { ...newGrid[index], clicked: true };
    setGrid(newGrid);
    
    // Check if this was a correct click (target symbol)
    if (grid[index].id === currentTest.targetSymbol) {
      setCorrectClicks(prev => prev + 1);
    } else {
      setIncorrectClicks(prev => prev + 1);
    }
  };
  
  const endCurrentTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const timeSpent = (Date.now() - testStartTime) / 1000;
    
    // Count missed targets
    const targetSymbols = grid.filter(item => item.id === currentTest.targetSymbol);
    const missedTargets = targetSymbols.filter(item => !item.clicked).length;
    
    // Save result of this test
    setTestResults(prev => [
      ...prev,
      {
        testId: currentTest.id,
        correctClicks,
        incorrectClicks,
        targetCount: currentTest.targetCount,
        missedTargets,
        timeSpent
      }
    ]);
    
    // Move to the next test or show final results
    if (currentTestIndex < processingTests.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
      startTest(); // Start the next test immediately
    } else {
      completeAllTests();
    }
  };
  
  const completeAllTests = () => {
    setTestState("results");
    
    // Calculate overall score
    const totalTimeSpent = testResults.reduce((sum, result) => sum + result.timeSpent, 0);
    const totalCorrectClicks = testResults.reduce((sum, result) => sum + result.correctClicks, 0);
    const totalIncorrectClicks = testResults.reduce((sum, result) => sum + result.incorrectClicks, 0);
    const totalTargets = testResults.reduce((sum, result) => sum + result.targetCount, 0);
    const totalMissedTargets = testResults.reduce((sum, result) => sum + result.missedTargets, 0);
    
    // Calculate accuracy percentage
    const accuracy = (totalCorrectClicks / (totalCorrectClicks + totalIncorrectClicks + totalMissedTargets)) * 100;
    
    // Calculate speed score based on average time per correct click
    const averageTimePerCorrect = totalTimeSpent / totalCorrectClicks;
    // Lower time is better - we'll convert to a 0-100 scale where 0.5s or less per target is perfect,
    // and 3s or more per target is 0
    const speedScore = Math.max(0, Math.min(100, ((3 - averageTimePerCorrect) / 2.5) * 100));
    
    // Final score is weighted average of accuracy and speed
    const score = Math.round((accuracy * 0.7) + (speedScore * 0.3));
    
    // Save test result
    saveTestResult({
      testId: "processing-speed",
      score,
      timeSpent: totalTimeSpent,
      completedAt: new Date().toISOString(),
      responses: testResults
    });
    
    toast({
      title: "Test completed",
      description: `Your processing speed score: ${score}%`,
    });
    
    onComplete();
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <TestContainer
      test={test}
      currentStep={currentTestIndex + 1}
      totalSteps={processingTests.length}
      onComplete={completeAllTests}
      onCancel={onCancel}
      showTimer={testState === "testing"}
      timeRemaining={timeRemaining}
    >
      {testState === "instructions" && (
        <div className="text-center py-6">
          <p className="mb-4">
            This test measures your processing speed - how quickly you can identify and respond to visual information.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Research shows that processing speed is often affected in individuals with dyslexia, 
            which can impact reading fluency and overall academic performance.
          </p>
          <Button onClick={startTest}>
            Start Test
          </Button>
        </div>
      )}
      
      {testState === "testing" && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">{currentTest.instructions}</h3>
            <div className="text-sm mb-4">
              Found: {correctClicks} of {currentTest.targetCount} | Time: {timeRemaining}s
            </div>
          </div>
          
          <div 
            className="grid gap-2 max-w-2xl mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${currentTest.gridSize}, minmax(0, 1fr))`
            }}
          >
            {grid.map((item, index) => (
              <button
                key={index}
                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl border rounded-md transition-all ${
                  item.clicked 
                    ? 'bg-gray-200 cursor-default' 
                    : 'bg-white hover:bg-gray-50 active:bg-gray-100'
                }`}
                onClick={() => handleSymbolClick(index)}
                disabled={item.clicked}
              >
                {item.symbol}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {testState === "results" && (
        <div className="text-center py-6">
          <h3 className="text-xl font-medium mb-4">Test Complete!</h3>
          <p>Thank you for completing the processing speed test.</p>
          <Button onClick={onComplete} className="mt-4">
            See Results
          </Button>
        </div>
      )}
    </TestContainer>
  );
};

export default ProcessingSpeedTest;
