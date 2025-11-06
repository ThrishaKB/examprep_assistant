export type Section = 'revision' | 'pyqs' | 'mockTest' | 'history';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface PYQ {
  question: string;
  chapter: string;
  marks: number;
}

export interface Weightage {
  chapter: string;
  percentage: number;
}

export interface PYQAnalysis {
  weightage: Weightage[];
  pyqs: PYQ[];
}

// Updated Question to be for typed answers, not MCQs
export interface Question {
  question: string;
  answer: string; // This is the model's correct answer
  chapter: string;
  marks: number;
}

export interface MockTestOptions {
  numQuestions: number;
  chapters: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// New type for evaluation result
export interface EvaluationResult {
    score: number;
    feedback: string;
}

// New types for storing test history
export interface SavedQuestion extends Question {
    userAnswer: string;
    evaluation: EvaluationResult | null;
}

export interface SavedTest {
    id: string; 
    date: string; // ISO string
    options: MockTestOptions;
    questions: SavedQuestion[];
    totalScore: number;
    maxScore: number;
}
