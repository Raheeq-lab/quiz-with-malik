
import { Quiz, StudentQuizResult, LeaderboardEntry } from '@/types/quiz';

export const getQuizResultsById = (results: StudentQuizResult[], quizId: string) => {
  return results.filter(r => r.quizId === quizId);
};

export const getLeaderboardEntries = (results: StudentQuizResult[], quizId: string): LeaderboardEntry[] => {
  const quizResults = getQuizResultsById(results, quizId);
  
  return quizResults.map(r => ({
    id: r.id,
    studentName: r.studentName,
    score: r.score,
    timeTaken: r.timeTaken,
    completedAt: r.completedAt
  }));
};

export const findQuizById = (quizzes: Quiz[], id: string): Quiz | undefined => {
  return quizzes.find(q => q.id === id);
};

export const getTotalStudents = (results: StudentQuizResult[]): number => {
  const studentIds = new Set();
  results.forEach(r => studentIds.add(r.studentName));
  return studentIds.size;
};

export const getTotalCompletions = (results: StudentQuizResult[]): number => {
  return results.length;
};
