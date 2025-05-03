
import React from 'react';
import { Button } from "@/components/ui/button";
import AccessCodeCard from '@/components/AccessCodeCard';
import { Quiz } from '@/types/quiz';
import { Book, BookOpen, BookText, Laptop, ArrowLeft } from 'lucide-react';

interface QuizzesTabProps {
  quizzes: Quiz[];
  onCreateQuiz: () => void;
  onCopyCode: (quizTitle: string) => void;
  subject?: "math" | "english" | "ict";
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({ quizzes, onCreateQuiz, onCopyCode, subject = "math" }) => {
  const getSubjectIcon = () => {
    switch (subject) {
      case "math": return <BookOpen size={18} className="text-purple-500" />;
      case "english": return <BookText size={18} className="text-green-500" />;
      case "ict": return <Laptop size={18} className="text-orange-500" />;
      default: return <BookOpen size={18} className="text-purple-500" />;
    }
  };

  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "bg-purple-600 hover:bg-purple-700";
      case "english": return "bg-green-600 hover:bg-green-700";
      case "ict": return "bg-orange-600 hover:bg-orange-700";
      default: return "bg-purple-600 hover:bg-purple-700";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {getSubjectIcon()}
          <span>My {subject.charAt(0).toUpperCase() + subject.slice(1)} Quizzes</span>
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button 
            onClick={onCreateQuiz}
            className={`text-white ${getSubjectColor()}`}
          >
            Create New Quiz
          </Button>
        </div>
      </div>
      
      {quizzes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Book size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">You haven't created any quizzes for this subject yet.</p>
          <p className="text-gray-500 mb-4">Get started by creating your first quiz!</p>
          <Button 
            onClick={onCreateQuiz}
            className={`text-white ${getSubjectColor()}`}
          >
            Create New Quiz
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <AccessCodeCard
              key={quiz.id}
              title={`${quiz.title} (Grade ${quiz.gradeLevel})`}
              accessCode={quiz.accessCode}
              onCopy={() => onCopyCode(quiz.title)}
              subject={quiz.subject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesTab;
