
export enum Domain {
  Secure = "Domain 1: Design Secure Architectures",
  Resilient = "Domain 2: Design Resilient Architectures",
  HighPerforming = "Domain 3: Design High-Performing Architectures",
  CostOptimized = "Domain 4: Design Cost-Optimized Architectures"
}

export type QuestionType = "SINGLE" | "MULTIPLE";

export interface Question {
  id: string;
  scenario: string;
  options: string[];
  correctAnswers: number[]; // indices
  domain: Domain;
  type: QuestionType;
  explanation: string;
}

export interface ExamSet {
  id: string;
  name: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedOptions: number[];
}

export interface ExamSession {
  setId: string;
  startTime: number;
  endTime?: number;
  answers: Record<string, number[]>;
  marked: Set<string>;
}
