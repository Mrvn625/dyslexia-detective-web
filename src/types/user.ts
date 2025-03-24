
export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  ageGroup?: "preschool" | "school" | "adolescent" | "adult" | "senior";
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  education: "preschool" | "elementary" | "middle-school" | "high-school" | "college" | "graduate" | "other";
  hasBeenDiagnosed: "yes" | "no" | "unsure";
  createdAt?: string;
  updatedAt?: string;
}
