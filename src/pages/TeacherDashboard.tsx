import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Book, FileText, Users, BarChart, Laptop, BookText } from "lucide-react";
import { Quiz, Lesson, StudentQuizResult, TeacherData } from '@/types/quiz';
import QuizForm from '@/components/QuizForm';
import LessonBuilder from '@/components/teacher/LessonBuilder';
import ScaffoldedLessonBuilder from '@/components/teacher/ScaffoldedLessonBuilder';
import DashboardHeader from '@/components/teacher/DashboardHeader';
import DashboardFooter from '@/components/teacher/DashboardFooter';
import QuizzesTab from '@/components/teacher/tabs/QuizzesTab';
import PerformanceTab from '@/components/teacher/tabs/PerformanceTab';
import QuestionGeneratorTab from '@/components/teacher/tabs/QuestionGeneratorTab';
import LessonsTab from '@/components/teacher/tabs/LessonsTab';
import SubjectSelector from '@/components/SubjectSelector';
import GradeSelector from '@/components/teacher/GradeSelector';
import { 
  getLeaderboardEntries, 
  findQuizById, 
  getTotalStudents, 
  getTotalCompletions 
} from '@/utils/dashboardUtils';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showLessonBuilder, setShowLessonBuilder] = useState(false);
  const [showScaffoldedLessonBuilder, setShowScaffoldedLessonBuilder] = useState(false);
  const [results, setResults] = useState<StudentQuizResult[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<"math" | "english" | "ict">("math");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  
  // Available grades are now 1-11 only
  const availableGrades = Array.from({ length: 11 }, (_, i) => i + 1);
  
  useEffect(() => {
    // Check if user is logged in
    const storedTeacher = localStorage.getItem('mathWithMalikTeacher');
    
    if (!storedTeacher) {
      navigate('/teacher-signup');
      return;
    }
    
    const teacher = JSON.parse(storedTeacher);
    setTeacherData(teacher);
    
    // Filter grades to only include 1-11
    const filteredGrades = (teacher.grades || []).filter(g => g >= 1 && g <= 11);
    setSelectedGrades(filteredGrades);
    
    // Load quizzes
    const storedQuizzes = localStorage.getItem('mathWithMalikQuizzes');
    if (storedQuizzes) {
      setQuizzes(JSON.parse(storedQuizzes));
    }

    // Load lessons
    const storedLessons = localStorage.getItem('mathWithMalikLessons');
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
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
      description: `Your new ${quiz.subject} quiz "${quiz.title}" is ready. Share the code with your students.`,
    });
  };

  const handleCreateLesson = (lesson: Lesson) => {
    const updatedLessons = [...lessons, lesson];
    setLessons(updatedLessons);
    localStorage.setItem('mathWithMalikLessons', JSON.stringify(updatedLessons));
    setShowLessonBuilder(false);
    setShowScaffoldedLessonBuilder(false);
    
    toast({
      title: "Lesson created!",
      description: `Your new ${lesson.subject} lesson "${lesson.title}" is ready. Share the code with your students.`,
    });
  };
  
  const handleCancelQuizForm = () => {
    setShowQuizForm(false);
  };

  const handleCancelLessonBuilder = () => {
    setShowLessonBuilder(false);
    setShowScaffoldedLessonBuilder(false);
  };
  
  const handleCopyCode = (title: string) => {
    toast({
      title: "Code copied!",
      description: `The access code for "${title}" has been copied to clipboard.`,
    });
  };

  const getSubjectIcon = () => {
    switch (selectedSubject) {
      case "math": return <Book className="text-purple-500" />;
      case "english": return <BookText className="text-green-500" />;
      case "ict": return <Laptop className="text-orange-500" />;
      default: return <Book className="text-purple-500" />;
    }
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const filteredQuizzes = quizzes.filter(quiz => quiz.subject === selectedSubject);
  const filteredLessons = lessons.filter(lesson => lesson.subject === selectedSubject);

  const handleCreateLessonClick = () => {
    // Show scaffolded lesson builder
    setShowScaffoldedLessonBuilder(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader 
        teacherName={teacherData?.name || ''} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Malik's Learning Lab</h1>

        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="w-full sm:w-1/2">
            <SubjectSelector 
              selectedSubject={selectedSubject}
              onChange={(subject) => setSelectedSubject(subject as "math" | "english" | "ict")}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <GradeSelector 
              selectedGrades={selectedGrades}
              onChange={setSelectedGrades}
              subject={selectedSubject}
              availableGrades={availableGrades}
            />
          </div>
        </div>
        
        {!showQuizForm && !showLessonBuilder && !showScaffoldedLessonBuilder ? (
          <Tabs defaultValue="quizzes">
            <TabsList className="mb-8">
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <Book size={16} />
                <span>Quiz Zone</span>
              </TabsTrigger>
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Lesson Builder</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart size={16} />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                {getSubjectIcon()}
                <span>Content Generator</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quizzes">
              <QuizzesTab 
                quizzes={filteredQuizzes} 
                onCreateQuiz={() => setShowQuizForm(true)} 
                onCopyCode={handleCopyCode} 
                subject={selectedSubject}
              />
            </TabsContent>

            <TabsContent value="lessons">
              <LessonsTab 
                lessons={filteredLessons} 
                onCreateLesson={handleCreateLessonClick} 
                onCopyCode={handleCopyCode} 
                subject={selectedSubject}
              />
            </TabsContent>
            
            <TabsContent value="performance">
              <PerformanceTab 
                quizzes={quizzes}
                getTotalStudents={() => getTotalStudents(results)}
                getTotalCompletions={() => getTotalCompletions(results)}
                getLeaderboardEntries={(quizId) => getLeaderboardEntries(results, quizId)}
                findQuizById={(id) => findQuizById(quizzes, id)}
                subject={selectedSubject}
              />
            </TabsContent>
            
            <TabsContent value="generate">
              <QuestionGeneratorTab 
                grades={selectedGrades} 
                subject={selectedSubject}
              />
            </TabsContent>
          </Tabs>
        ) : showQuizForm ? (
          <QuizForm 
            grades={selectedGrades} 
            onSave={handleCreateQuiz}
            onCancel={handleCancelQuizForm}
            subject={selectedSubject}
          />
        ) : showScaffoldedLessonBuilder ? (
          <ScaffoldedLessonBuilder 
            grades={selectedGrades} 
            onSave={handleCreateLesson}
            onCancel={handleCancelLessonBuilder}
            subject={selectedSubject}
          />
        ) : (
          <LessonBuilder 
            grades={selectedGrades} 
            onSave={handleCreateLesson}
            onCancel={handleCancelLessonBuilder}
            subject={selectedSubject}
          />
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default TeacherDashboard;
