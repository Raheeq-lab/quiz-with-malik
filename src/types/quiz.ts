
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
  lessonStructure?: LessonStructure; // Added new lesson structure
  activity?: ActivitySettings; // Added activity settings to Lesson
}

export interface LessonContent {
  id: string;
  type: "text" | "image" | "imageWithPrompt" | "dragAndDrop" | "labeling" | "video" | "activity"; // Added activity type
  content: string;
  imageUrl?: string;
  videoUrl?: string; // Added for video content
  prompt?: string;
  options?: string[];
  solution?: string | string[];
  activity?: ActivitySettings; // Activity settings for the content block
}

export interface TeacherData {
  id: string;
  name: string;
  email: string;
  school?: string;
  grades: number[];
  subjects: ("math" | "english" | "ict")[];
}

export interface LessonStructure {
  engage: LessonPhase;
  model: LessonPhase;
  guidedPractice: LessonPhase;
  independentPractice: LessonPhase;
  reflect: LessonPhase;
}

export interface LessonPhase {
  title: string;
  timeInMinutes: number;
  content: LessonPhaseContent[];
}

export interface LessonPhaseContent {
  id: string;
  type: "text" | "image" | "video" | "quiz" | "activity" | "resource";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  resourceUrl?: string;
  aiToolUsed?: string;
  activity?: ActivitySettings; // Added activity settings to lesson phase content
}

// Activity settings interface
export interface ActivitySettings {
  activityType: "teacher-led" | "print-practice" | "student-devices" | "game";
  gameType?: "quiz" | "grid"; // Added game type for grid game
  teamMode: {
    enabled: boolean;
    numberOfTeams?: number;
    teams?: TeamInfo[];
  };
  scoring: {
    enabled: boolean;
    type?: "points" | "badges";
  };
  gameTitle?: string;
  gameQuestions?: GameQuestion[];
  gameSettings?: {
    randomizeQuestions?: boolean;
    timerEnabled?: boolean;
    timerDuration?: number;
    gridSize?: number; // Added grid size for grid games (2x2, 3x3, 4x4, etc)
  };
}

// Team information interface
export interface TeamInfo {
  id: string;
  name: string;
  color: string;
  emoji: string;
  score?: number;
}

// Game question interface
export interface GameQuestion {
  id: string;
  text: string;
  type: "text" | "image" | "multiple-choice";
  imageUrl?: string;
  options?: string[];
  correctOption?: number;
  answer?: string;
  points: number;
}
