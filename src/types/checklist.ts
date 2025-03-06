
export interface ChecklistItem {
  id: string;
  question: string;
  category: string;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
}

export type ChecklistResponse = Record<string, boolean | null>;
