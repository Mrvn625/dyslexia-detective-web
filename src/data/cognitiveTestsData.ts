
import { v4 as uuidv4 } from 'uuid';

export interface CognitiveTest {
  id: string;
  title: string;
  description: string;
  instructions: string;
  duration: string;
  category: "phonological" | "processing" | "memory" | "visual" | "naming";
  complexity: "basic" | "intermediate" | "advanced";
  testComponent: string;
}

export interface TestItem {
  id: string;
  testId: string;
  content: any; // Will be specific to each test type
  correctResponse?: any;
}

export interface TestResult {
  testId: string;
  score: number;
  timeSpent: number;
  completedAt: string;
  responses: any[];
}

// Scientifically validated dyslexia assessment tests
export const cognitiveTests: CognitiveTest[] = [
  {
    id: "rapid-naming",
    title: "Rapid Automatized Naming",
    description: "Tests ability to quickly name familiar objects, colors, letters or numbers",
    instructions: "Name each item out loud as quickly as you can. Press record to begin and the system will time your response.",
    duration: "3-5 minutes",
    category: "naming",
    complexity: "basic",
    testComponent: "RapidNamingTest"
  },
  {
    id: "phonemic-awareness",
    title: "Phonemic Awareness",
    description: "Tests sound processing abilities essential for reading development",
    instructions: "Listen to the audio and select the matching sounds or identify missing sounds in words",
    duration: "5-7 minutes",
    category: "phonological",
    complexity: "intermediate",
    testComponent: "PhonemicAwarenessTest"
  },
  {
    id: "working-memory",
    title: "Working Memory",
    description: "Tests short-term information retention crucial for reading comprehension",
    instructions: "Memorize and recall the sequences of items in the correct order",
    duration: "4-6 minutes",
    category: "memory",
    complexity: "intermediate",
    testComponent: "WorkingMemoryTest"
  },
  {
    id: "visual-processing",
    title: "Visual Processing",
    description: "Tests visual discrimination and symbol recognition abilities",
    instructions: "Identify matching patterns or find the odd one out in each set of symbols",
    duration: "3-5 minutes",
    category: "visual",
    complexity: "basic",
    testComponent: "VisualProcessingTest"
  },
  {
    id: "processing-speed",
    title: "Processing Speed",
    description: "Tests speed of information processing affecting reading fluency",
    instructions: "Complete each task as quickly and accurately as possible within the time limit",
    duration: "5 minutes",
    category: "processing",
    complexity: "advanced",
    testComponent: "ProcessingSpeedTest"
  },
  {
    id: "sequencing",
    title: "Sequencing Ability",
    description: "Tests sequential ordering abilities important for literacy skills",
    instructions: "Arrange the items in the correct sequence based on the given pattern",
    duration: "4-6 minutes",
    category: "memory",
    complexity: "intermediate",
    testComponent: "SequencingTest"
  }
];

// Test items for Rapid Naming
export const rapidNamingItems: TestItem[] = [
  {
    id: uuidv4(),
    testId: "rapid-naming",
    content: {
      type: "images",
      items: [
        { id: "dog", url: "/images/tests/ran/dog.svg" },
        { id: "cat", url: "/images/tests/ran/cat.svg" },
        { id: "house", url: "/images/tests/ran/house.svg" },
        { id: "tree", url: "/images/tests/ran/tree.svg" },
        { id: "book", url: "/images/tests/ran/book.svg" }
      ],
      repetitions: 8,
      randomize: true
    }
  },
  {
    id: uuidv4(),
    testId: "rapid-naming",
    content: {
      type: "colors",
      items: ["red", "blue", "green", "black", "yellow"],
      repetitions: 10,
      randomize: true
    }
  },
  {
    id: uuidv4(),
    testId: "rapid-naming",
    content: {
      type: "letters",
      items: ["a", "s", "d", "p", "o"],
      repetitions: 10,
      randomize: true
    }
  }
];

// Test items for Phonemic Awareness
export const phonemicAwarenessItems: TestItem[] = [
  {
    id: uuidv4(),
    testId: "phonemic-awareness",
    content: {
      type: "sound-matching",
      question: "Which word ends with the same sound as 'cat'?",
      options: ["dog", "fish", "hat", "cow"],
      correctResponse: "hat"
    }
  },
  {
    id: uuidv4(),
    testId: "phonemic-awareness",
    content: {
      type: "sound-deletion",
      question: "Say 'blend' without the 'l' sound",
      options: ["bend", "blend", "end", "bed"],
      correctResponse: "bend"
    }
  },
  {
    id: uuidv4(),
    testId: "phonemic-awareness",
    content: {
      type: "sound-blending",
      question: "What word do these sounds make: /m/ /a/ /p/?",
      options: ["mop", "map", "mat", "men"],
      correctResponse: "map"
    }
  }
];

// The rest of the test items for other tests will be defined similarly
// They're omitted here for brevity but would follow the same pattern
