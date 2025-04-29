
import React from 'react';
import { Button } from "@/components/ui/button";
import AccessCodeCard from '@/components/AccessCodeCard';
import { Quiz } from '@/types/quiz';

interface QuizzesTabProps {
  quizzes: Quiz[];
  onCreateQuiz: () => void;
  onCopyCode: (quizTitle: string) => void;
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({ quizzes, onCreateQuiz, onCopyCode }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Math Quizzes</h2>
        <Button 
          onClick={onCreateQuiz}
          className="bg-quiz-purple text-white"
        >
          Create New Quiz
        </Button>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="text-center py-12 bg-quiz-light rounded-lg">
          <p className="text-gray-500">You haven't created any quizzes yet.</p>
          <p className="text-gray-500">Get started by creating your first math quiz!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <AccessCodeCard
              key={quiz.id}
              title={`${quiz.title} (Grade ${quiz.gradeLevel})`}
              accessCode={quiz.accessCode}
              onCopy={() => onCopyCode(quiz.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesTab;
