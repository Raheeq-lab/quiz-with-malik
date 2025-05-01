
export interface Quiz {
  id: string;
  title: string;
  description: string;
  gradeLevel: number;
  timeLimit: number; // in seconds
  accessCode: string;
  createdBy: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  imageUrl?: string; // Added for question images
}

export interface StudentQuizResult {
  id: string;
  studentName: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  completedAt: string;
  answers: StudentAnswer[];
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeTaken?: number; // in seconds
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  score: number;
  timeTaken: number;
  completedAt: string;
}
