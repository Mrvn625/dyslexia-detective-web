
import { ChecklistItem, ChecklistCategory } from "../types/checklist";

export const checklistCategories: ChecklistCategory[] = [
  {
    id: "reading",
    name: "Reading Skills",
    description: "Challenges related to reading fluency, accuracy, and comprehension",
  },
  {
    id: "writing",
    name: "Writing Skills",
    description: "Difficulties with handwriting, spelling, and written expression",
  },
  {
    id: "phonological",
    name: "Phonological Awareness",
    description: "Ability to recognize and work with sounds in spoken language",
  },
  {
    id: "memory",
    name: "Memory and Processing",
    description: "Challenges with working memory, sequencing, and processing information",
  },
  {
    id: "organizational",
    name: "Organizational Skills",
    description: "Difficulties with time management, organization, and following directions",
  },
];

export const checklistItems: ChecklistItem[] = [
  // Reading Skills
  {
    id: "r1",
    question: "Reads slowly or laboriously compared to peers",
    category: "reading",
  },
  {
    id: "r2",
    question: "Has difficulty sounding out new or unfamiliar words",
    category: "reading",
  },
  {
    id: "r3",
    question: "Often guesses at words based on first or last letters",
    category: "reading",
  },
  {
    id: "r4",
    question: "Skips over or adds small words when reading (e.g., 'the', 'and', 'to')",
    category: "reading",
  },
  {
    id: "r5",
    question: "Struggles to understand what was just read, even if able to read the words",
    category: "reading",
  },
  
  // Writing Skills
  {
    id: "w1",
    question: "Has messy, inconsistent, or laborious handwriting",
    category: "writing",
  },
  {
    id: "w2",
    question: "Spells the same word differently in a single document",
    category: "writing",
  },
  {
    id: "w3",
    question: "Has difficulty putting thoughts into written words",
    category: "writing",
  },
  {
    id: "w4",
    question: "Written work has many grammatical or punctuation errors",
    category: "writing",
  },
  {
    id: "w5",
    question: "Avoids writing tasks or takes much longer than peers to complete them",
    category: "writing",
  },
  
  // Phonological Awareness
  {
    id: "p1",
    question: "Has difficulty breaking words into individual sounds",
    category: "phonological",
  },
  {
    id: "p2",
    question: "Struggles to rhyme words appropriately",
    category: "phonological",
  },
  {
    id: "p3",
    question: "Has trouble distinguishing between similar-sounding words",
    category: "phonological",
  },
  {
    id: "p4",
    question: "Mispronounces words or confuses words that sound similar",
    category: "phonological",
  },
  {
    id: "p5",
    question: "Has difficulty learning and remembering new vocabulary",
    category: "phonological",
  },
  
  // Memory and Processing
  {
    id: "m1",
    question: "Has trouble remembering sequences (alphabet, days of week, months)",
    category: "memory",
  },
  {
    id: "m2",
    question: "Struggles to remember verbal instructions",
    category: "memory",
  },
  {
    id: "m3",
    question: "Has difficulty remembering facts and information not experienced directly",
    category: "memory",
  },
  {
    id: "m4",
    question: "Takes longer to answer questions or retrieve specific words",
    category: "memory",
  },
  {
    id: "m5",
    question: "Forgets familiar words or names",
    category: "memory",
  },
  
  // Organizational Skills
  {
    id: "o1",
    question: "Has difficulty keeping track of belongings or assignments",
    category: "organizational",
  },
  {
    id: "o2",
    question: "Struggles with time management and estimating how long tasks will take",
    category: "organizational",
  },
  {
    id: "o3",
    question: "Has trouble following a sequence of directions",
    category: "organizational",
  },
  {
    id: "o4",
    question: "Often begins tasks without reading instructions thoroughly",
    category: "organizational",
  },
  {
    id: "o5",
    question: "Has difficulty organizing thoughts when speaking",
    category: "organizational",
  },
];
