
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TestContainer from "./TestContainer";
import { cognitiveTests } from "@/data/cognitiveTestsData";
import { saveTestResult } from "@/utils/testUtils";

// Test items for sequencing test
const sequencingItems = [
  {
    id: 'seq1',
    type: 'alphabet',
    instructions: "Arrange the letters in alphabetical order",
    items: ["J", "F", "P", "B", "M"],
    correctOrder: ["B", "F", "J", "M", "P"]
  },
  {
    id: 'seq2',
    type: 'numbers',
    instructions: "Arrange the numbers in ascending order",
    items: ["9", "3", "7", "1", "5"],
    correctOrder: ["1", "3", "5", "7", "9"]
  },
  {
    id: 'seq3',
    type: 'months',
    instructions: "Arrange the months in calendar order",
    items: ["Dec", "Apr", "Aug", "Jan", "Jun"],
    correctOrder: ["Jan", "Apr", "Jun", "Aug", "Dec"]
  },
  {
    id: 'seq4',
    type: 'story',
    instructions: "Arrange the sentences to form a logical story",
    items: [
      "They quickly called for help.",
      "A family was enjoying a picnic in the park.",
      "Everyone was relieved when the firefighters arrived.",
      "Suddenly, they noticed smoke coming from a nearby tree.",
      "The firefighters put out the small fire before it could spread."
    ],
    correctOrder: [
      "A family was enjoying a picnic in the park.",
      "Suddenly, they noticed smoke coming from a nearby tree.",
      "They quickly called for help.",
      "Everyone was relieved when the firefighters arrived.",
      "The firefighters put out the small fire before it could spread."
    ]
  }
];

// Sortable item component
const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border rounded-md p-3 mb-2 cursor-grab active:cursor-grabbing shadow-sm"
    >
      {children}
    </div>
  );
};

const SequencingTest: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [testStartTime, setTestStartTime] = useState(0);
  const [results, setResults] = useState<Array<{
    itemId: string;
    userOrder: string[];
    correctOrder: string[];
    isCorrect: boolean;
    timeSpent: number;
  }>>([]);
  const [testInProgress, setTestInProgress] = useState(false);
  
  const itemStartTimeRef = useRef<number>(0);
  const { toast } = useToast();
  
  const test = cognitiveTests.find(test => test.id === "sequencing")!;
  const currentSequenceItem = sequencingItems[currentItemIndex];
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const startTest = () => {
    setTestInProgress(true);
    setTestStartTime(Date.now());
    itemStartTimeRef.current = Date.now();
    
    // Shuffle the items
    setItems([...currentSequenceItem.items].sort(() => Math.random() - 0.5));
  };
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item === active.id);
        const newIndex = items.findIndex(item => item === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const handleSubmit = () => {
    const timeSpent = (Date.now() - itemStartTimeRef.current) / 1000;
    
    // Check if the order is correct
    const isCorrect = items.every((item, index) => item === currentSequenceItem.correctOrder[index]);
    
    // Record result
    setResults(prev => [
      ...prev,
      {
        itemId: currentSequenceItem.id,
        userOrder: [...items],
        correctOrder: [...currentSequenceItem.correctOrder],
        isCorrect,
        timeSpent
      }
    ]);
    
    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Great job! The sequence is correct." 
        : "The sequence is not in the correct order.",
      variant: isCorrect ? "default" : "destructive"
    });
    
    // Move to the next sequence or complete the test
    if (currentItemIndex < sequencingItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      itemStartTimeRef.current = Date.now();
      // Shuffle the items for the next sequence
      setItems([...sequencingItems[currentItemIndex + 1].items].sort(() => Math.random() - 0.5));
    } else {
      completeTest();
    }
  };
  
  const completeTest = () => {
    if (!testInProgress) return;
    
    const totalTimeSpent = (Date.now() - testStartTime) / 1000;
    
    // Calculate score based on correct sequences and time
    const correctSequences = results.filter(r => r.isCorrect).length;
    const baseScore = (correctSequences / sequencingItems.length) * 100;
    
    // Adjust score based on average time per item
    // Typical sequencing speed varies by complexity, but we'll use a simplified model
    // where faster = better, with diminishing returns
    const avgTimePerItem = results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length;
    const timeBonus = Math.max(0, Math.min(15, 15 * (1 - (avgTimePerItem / 60)))); // Max 15% bonus for speed
    
    const score = Math.round(baseScore + timeBonus);
    
    // Save test result
    saveTestResult({
      testId: "sequencing",
      score,
      timeSpent: totalTimeSpent,
      completedAt: new Date().toISOString(),
      responses: results
    });
    
    toast({
      title: "Test completed",
      description: `Your score: ${score}% (${correctSequences} of ${sequencingItems.length} sequences correct)`,
    });
    
    setTestInProgress(false);
    onComplete();
  };
  
  return (
    <TestContainer
      test={test}
      currentStep={currentItemIndex + 1}
      totalSteps={sequencingItems.length}
      onComplete={completeTest}
      onCancel={onCancel}
    >
      {!testInProgress ? (
        <div className="text-center py-6">
          <p className="mb-4">
            This test evaluates your sequencing ability - how well you can arrange items in a logical or expected order.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Research shows that sequencing difficulties are common in individuals with dyslexia, 
            affecting organizational skills, reading comprehension, and spelling.
          </p>
          <Button onClick={startTest}>
            Start Test
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-center mb-2">{currentSequenceItem.instructions}</h3>
          <p className="text-sm text-center text-gray-600 mb-4">Drag and drop the items to rearrange them</p>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items}>
              <div className="max-w-md mx-auto">
                {items.map((item) => (
                  <SortableItem key={item} id={item}>
                    {item}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit}>
              {currentItemIndex < sequencingItems.length - 1 ? "Submit & Next" : "Complete Test"}
            </Button>
          </div>
        </div>
      )}
    </TestContainer>
  );
};

export default SequencingTest;
