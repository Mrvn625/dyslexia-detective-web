
export interface ChecklistItem {
  id: string;
  question: string;
  category: string;
  ageGroups: string[]; // Which age groups this question applies to
}

export interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
}

export type ChecklistResponse = Record<string, boolean | null>;

export interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  description: string;
}
