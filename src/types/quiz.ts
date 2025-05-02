
export interface Quiz {
  id: string;
  title: string;
  description: string;
  gradeLevel: number;
  subject: "math" | "english" | "ict"; // Added subject field
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

export interface Lesson {
  id: string;
  title: string;
  description: string;
  gradeLevel: number;
  subject: "math" | "english" | "ict";
  content: LessonContent[];
  createdBy: string;
  createdAt: string;
  accessCode: string;
  learningType: string; // Added learningType property
}

export interface LessonContent {
  id: string;
  type: "text" | "image" | "imageWithPrompt" | "dragAndDrop" | "labeling";
  content: string;
  imageUrl?: string;
  prompt?: string;
  options?: string[];
  solution?: string | string[];
}

export interface TeacherData {
  id: string;
  name: string;
  email: string;
  school?: string;
  grades: number[];
  subjects: ("math" | "english" | "ict")[];
}
