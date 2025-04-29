
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Book, FileText, Users, BarChart } from "lucide-react";
import { Quiz, StudentQuizResult } from '@/types/quiz';
import QuizForm from '@/components/QuizForm';
import DashboardHeader from '@/components/teacher/DashboardHeader';
import DashboardFooter from '@/components/teacher/DashboardFooter';
import QuizzesTab from '@/components/teacher/tabs/QuizzesTab';
import PerformanceTab from '@/components/teacher/tabs/PerformanceTab';
import QuestionGeneratorTab from '@/components/teacher/tabs/QuestionGeneratorTab';
import { 
  getLeaderboardEntries, 
  findQuizById, 
  getTotalStudents, 
  getTotalCompletions 
} from '@/utils/dashboardUtils';

interface TeacherData {
  id: string;
  name: string;
  email: string;
  school?: string;
  grades: number[];
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [results, setResults] = useState<StudentQuizResult[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const storedTeacher = localStorage.getItem('mathWithMalikTeacher');
    
    if (!storedTeacher) {
      navigate('/teacher-signup');
      return;
    }
    
    const teacher = JSON.parse(storedTeacher);
    setTeacherData(teacher);
    
    // Load quizzes
    const storedQuizzes = localStorage.getItem('mathWithMalikQuizzes');
    if (storedQuizzes) {
      setQuizzes(JSON.parse(storedQuizzes));
    }

    // Load quiz results
    const storedResults = localStorage.getItem('mathWithMalikResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    
    setIsLoading(false);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('mathWithMalikTeacher');
    navigate('/');
  };
  
  const handleCreateQuiz = (quiz: Quiz) => {
    const updatedQuizzes = [...quizzes, quiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('mathWithMalikQuizzes', JSON.stringify(updatedQuizzes));
    setShowQuizForm(false);
    
    toast({
      title: "Quiz created!",
      description: `Your new quiz "${quiz.title}" is ready. Share the code with your students.`,
    });
  };
  
  const handleCancelQuizForm = () => {
    setShowQuizForm(false);
  };
  
  const handleCopyCode = (quizTitle: string) => {
    toast({
      title: "Code copied!",
      description: `The access code for "${quizTitle}" has been copied to clipboard.`,
    });
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader 
        teacherName={teacherData?.name || ''} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
        
        {!showQuizForm ? (
          <Tabs defaultValue="quizzes">
            <TabsList className="mb-8">
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <Book size={16} />
                <span>Quizzes</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart size={16} />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Question Generator</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quizzes">
              <QuizzesTab 
                quizzes={quizzes} 
                onCreateQuiz={() => setShowQuizForm(true)} 
                onCopyCode={handleCopyCode} 
              />
            </TabsContent>
            
            <TabsContent value="performance">
              <PerformanceTab 
                quizzes={quizzes}
                getTotalStudents={() => getTotalStudents(results)}
                getTotalCompletions={() => getTotalCompletions(results)}
                getLeaderboardEntries={(quizId) => getLeaderboardEntries(results, quizId)}
                findQuizById={(id) => findQuizById(quizzes, id)}
              />
            </TabsContent>
            
            <TabsContent value="generate">
              <QuestionGeneratorTab grades={teacherData?.grades || []} />
            </TabsContent>
          </Tabs>
        ) : (
          <QuizForm 
            grades={teacherData?.grades || []} 
            onSave={handleCreateQuiz}
            onCancel={handleCancelQuizForm}
          />
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default TeacherDashboard;
