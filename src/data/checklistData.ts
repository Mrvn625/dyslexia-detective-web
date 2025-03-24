
import { ChecklistItem, ChecklistCategory, AgeGroup } from "../types/checklist";

export const ageGroups: AgeGroup[] = [
  {
    id: "preschool",
    name: "Preschool",
    ageRange: "3-5 years",
    description: "Early childhood indicators that may suggest risk for dyslexia"
  },
  {
    id: "school",
    name: "School Age",
    ageRange: "6-12 years",
    description: "Elementary and middle school indicators of dyslexia"
  },
  {
    id: "adolescent",
    name: "Adolescent",
    ageRange: "13-17 years",
    description: "Teenage indicators of dyslexia that may affect academic performance"
  },
  {
    id: "adult",
    name: "Adult",
    ageRange: "18+ years",
    description: "Adult indicators of dyslexia that may affect career and daily life"
  }
];

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
  // === PRESCHOOL ITEMS (3-5 years) ===
  // Reading Skills - Preschool
  {
    id: "pr1",
    question: "Has difficulty recognizing and naming letters of the alphabet",
    category: "reading",
    ageGroups: ["preschool"]
  },
  {
    id: "pr2",
    question: "Shows little interest in books or being read to",
    category: "reading",
    ageGroups: ["preschool"]
  },
  {
    id: "pr3",
    question: "Has trouble learning nursery rhymes or simple song lyrics",
    category: "reading",
    ageGroups: ["preschool"]
  },
  {
    id: "pr4",
    question: "Struggles to recognize their own name in print",
    category: "reading",
    ageGroups: ["preschool"]
  },
  
  // Phonological Awareness - Preschool
  {
    id: "pp1",
    question: "Has difficulty identifying rhyming words (like cat-hat)",
    category: "phonological",
    ageGroups: ["preschool"]
  },
  {
    id: "pp2",
    question: "Struggles to count syllables in words (like ba-na-na)",
    category: "phonological",
    ageGroups: ["preschool"]
  },
  {
    id: "pp3",
    question: "Has trouble identifying the first sound in words",
    category: "phonological",
    ageGroups: ["preschool"]
  },
  {
    id: "pp4",
    question: "Difficulty learning and saying new words correctly",
    category: "phonological",
    ageGroups: ["preschool"]
  },
  {
    id: "pp5",
    question: "Mixes up sounds in multi-syllable words (like 'aminal' for 'animal')",
    category: "phonological",
    ageGroups: ["preschool"]
  },
  
  // Memory and Processing - Preschool
  {
    id: "pm1",
    question: "Has trouble remembering simple directions",
    category: "memory",
    ageGroups: ["preschool"]
  },
  {
    id: "pm2",
    question: "Struggles to learn sequences like days of the week",
    category: "memory",
    ageGroups: ["preschool"]
  },
  {
    id: "pm3",
    question: "Difficulty remembering names of familiar people or objects",
    category: "memory",
    ageGroups: ["preschool"]
  },
  
  // Organizational Skills - Preschool
  {
    id: "po1",
    question: "Has difficulty with sorting objects by shape, color, or size",
    category: "organizational",
    ageGroups: ["preschool"]
  },
  {
    id: "po2",
    question: "Struggles to follow multi-step directions (like 'pick up the ball and put it in the box')",
    category: "organizational",
    ageGroups: ["preschool"]
  },
  
  // Writing Skills - Preschool
  {
    id: "pw1",
    question: "Has difficulty holding a crayon or pencil correctly",
    category: "writing",
    ageGroups: ["preschool"]
  },
  {
    id: "pw2",
    question: "Struggles with drawing basic shapes or copying lines",
    category: "writing",
    ageGroups: ["preschool"]
  },
  
  // === SCHOOL AGE ITEMS (6-12 years) ===
  // Reading Skills - School Age
  {
    id: "sr1",
    question: "Reads slowly or laboriously compared to peers",
    category: "reading",
    ageGroups: ["school", "adolescent"]
  },
  {
    id: "sr2",
    question: "Has difficulty sounding out new or unfamiliar words",
    category: "reading",
    ageGroups: ["school", "adolescent"]
  },
  {
    id: "sr3",
    question: "Often guesses at words based on first or last letters",
    category: "reading",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sr4",
    question: "Skips over or adds small words when reading (e.g., 'the', 'and', 'to')",
    category: "reading",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sr5",
    question: "Struggles to understand what was just read, even if able to read the words",
    category: "reading",
    ageGroups: ["school", "adolescent", "adult"]
  },
  
  // Writing Skills - School Age
  {
    id: "sw1",
    question: "Has messy, inconsistent, or laborious handwriting",
    category: "writing",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sw2",
    question: "Spells the same word differently in a single document",
    category: "writing",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sw3",
    question: "Has difficulty putting thoughts into written words",
    category: "writing",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sw4",
    question: "Written work has many grammatical or punctuation errors",
    category: "writing",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sw5",
    question: "Avoids writing tasks or takes much longer than peers to complete them",
    category: "writing",
    ageGroups: ["school", "adolescent", "adult"]
  },
  
  // Phonological Awareness - School Age
  {
    id: "sp1",
    question: "Has difficulty breaking words into individual sounds",
    category: "phonological",
    ageGroups: ["school", "adolescent"]
  },
  {
    id: "sp2",
    question: "Struggles to rhyme words appropriately",
    category: "phonological",
    ageGroups: ["school", "adolescent"]
  },
  {
    id: "sp3",
    question: "Has trouble distinguishing between similar-sounding words",
    category: "phonological",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sp4",
    question: "Mispronounces words or confuses words that sound similar",
    category: "phonological",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sp5",
    question: "Has difficulty learning and remembering new vocabulary",
    category: "phonological",
    ageGroups: ["school", "adolescent", "adult"]
  },
  
  // Memory and Processing - School Age
  {
    id: "sm1",
    question: "Has trouble remembering sequences (alphabet, days of week, months)",
    category: "memory",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sm2",
    question: "Struggles to remember verbal instructions",
    category: "memory",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sm3",
    question: "Has difficulty remembering facts and information not experienced directly",
    category: "memory",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sm4",
    question: "Takes longer to answer questions or retrieve specific words",
    category: "memory",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "sm5",
    question: "Forgets familiar words or names",
    category: "memory",
    ageGroups: ["school", "adolescent", "adult"]
  },
  
  // Organizational Skills - School Age
  {
    id: "so1",
    question: "Has difficulty keeping track of belongings or assignments",
    category: "organizational",
    ageGroups: ["school", "adolescent"]
  },
  {
    id: "so2",
    question: "Struggles with time management and estimating how long tasks will take",
    category: "organizational",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "so3",
    question: "Has trouble following a sequence of directions",
    category: "organizational",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "so4",
    question: "Often begins tasks without reading instructions thoroughly",
    category: "organizational",
    ageGroups: ["school", "adolescent", "adult"]
  },
  {
    id: "so5",
    question: "Has difficulty organizing thoughts when speaking",
    category: "organizational",
    ageGroups: ["school", "adolescent", "adult"]
  },
  
  // === ADOLESCENT ITEMS (13-17 years) ===
  // Reading Skills - Adolescent specific
  {
    id: "ar1",
    question: "Reading speed significantly impacts ability to complete assignments or tests",
    category: "reading",
    ageGroups: ["adolescent", "adult"]
  },
  {
    id: "ar2",
    question: "Struggles with subject-specific vocabulary in different classes",
    category: "reading",
    ageGroups: ["adolescent"]
  },
  {
    id: "ar3",
    question: "Prefers to listen to audiobooks rather than reading text",
    category: "reading",
    ageGroups: ["adolescent", "adult"]
  },
  
  // Writing Skills - Adolescent specific
  {
    id: "aw1",
    question: "Essays lack organization or logical structure despite understanding the subject",
    category: "writing",
    ageGroups: ["adolescent", "adult"]
  },
  {
    id: "aw2",
    question: "Significant difference between verbal ability and written expression",
    category: "writing",
    ageGroups: ["adolescent", "adult"]
  },
  
  // === ADULT ITEMS (18+ years) ===
  // Reading Skills - Adult specific
  {
    id: "adr1",
    question: "Avoids reading aloud in work or social situations",
    category: "reading",
    ageGroups: ["adult"]
  },
  {
    id: "adr2",
    question: "Struggles with forms, applications, or written instructions",
    category: "reading",
    ageGroups: ["adult"]
  },
  {
    id: "adr3",
    question: "Reading comprehension requires multiple re-readings of the same text",
    category: "reading",
    ageGroups: ["adult"]
  },
  
  // Writing Skills - Adult specific
  {
    id: "adw1",
    question: "Relies heavily on spell-check and grammar-check tools",
    category: "writing",
    ageGroups: ["adult"]
  },
  {
    id: "adw2",
    question: "Avoids jobs or tasks that require extensive writing",
    category: "writing",
    ageGroups: ["adult"]
  },
  
  // Memory and Processing - Adult specific
  {
    id: "adm1",
    question: "Difficulty taking notes during meetings or lectures",
    category: "memory",
    ageGroups: ["adult"]
  },
  {
    id: "adm2",
    question: "Struggles to remember details from written materials at work",
    category: "memory",
    ageGroups: ["adult"]
  },
  
  // Organizational Skills - Adult specific
  {
    id: "ado1",
    question: "Struggles with financial paperwork or documentation",
    category: "organizational",
    ageGroups: ["adult"]
  },
  {
    id: "ado2",
    question: "Has developed elaborate systems or relies on technology to compensate for organizational challenges",
    category: "organizational",
    ageGroups: ["adult"]
  }
];
