
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Book, FileText, Users, BarChart, Clock } from "lucide-react";
import AccessCodeCard from '@/components/AccessCodeCard';
import QuizForm from '@/components/QuizForm';
import LeaderboardComponent from '@/components/LeaderboardComponent';
import { Quiz, LeaderboardEntry, StudentQuizResult } from '@/types/quiz';

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
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState("");
  const [results, setResults] = useState<StudentQuizResult[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  
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

  const handleGenerateQuestions = async () => {
    if (!topic.trim() || !selectedGrade) {
      toast({
        title: "Information required",
        description: "Please enter both a topic and select a grade level.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQuestions(true);

    // Simulate AI question generation (in a real app, this would be an API call to an AI service)
    setTimeout(() => {
      // Mock AI-generated questions based on topic and grade
      const grade = parseInt(selectedGrade);
      const difficultyLevel = grade <= 6 ? "basic" : "intermediate";
      
      const generateMockQuestions = () => {
        // Generate math questions based on the grade level
        const questions = [];
        
        if (grade <= 4) {
          // Basic arithmetic for lower grades
          questions.push({
            text: `What is 25 + 37?`,
            options: ["52", "62", "72", "42"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `If you have 5 apples and eat 2, how many do you have left?`,
            options: ["2", "3", "5", "7"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `What is 9 × 4?`,
            options: ["13", "36", "45", "27"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `What is half of 18?`,
            options: ["9", "8", "6", "10"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `Which number is greater: 43 or 34?`,
            options: ["43", "34", "They are equal", "Cannot determine"],
            correctOptionIndex: 0
          });
        } else if (grade <= 7) {
          // Intermediate math for middle grades
          questions.push({
            text: `What is the value of x in the equation: 3x + 5 = 20?`,
            options: ["5", "15", "7.5", "5.5"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `What is the area of a rectangle with length 8 cm and width 6 cm?`,
            options: ["14 cm²", "28 cm²", "48 cm²", "54 cm²"],
            correctOptionIndex: 2
          });
          questions.push({
            text: `What is 1/4 + 3/8?`,
            options: ["4/12", "5/8", "6/12", "7/8"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `If 30% of a number is 15, what is the number?`,
            options: ["45", "50", "30", "60"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `The average of 5 numbers is 12. If 4 of the numbers are 10, 15, 8, and 12, what is the 5th number?`,
            options: ["13", "14", "15", "16"],
            correctOptionIndex: 2
          });
        } else {
          // Advanced math for higher grades
          questions.push({
            text: `Simplify: 3(2x - 4) - 2(x + 5)`,
            options: ["4x - 22", "4x - 10", "6x - 22", "8x - 22"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `What is the solution to the quadratic equation x² - 5x + 6 = 0?`,
            options: ["x = 2, x = 3", "x = -2, x = -3", "x = 2, x = -3", "x = -2, x = 3"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `If a triangle has sides of length 6, 8, and 10, what type of triangle is it?`,
            options: ["Equilateral", "Isosceles", "Scalene", "Right"],
            correctOptionIndex: 3
          });
          questions.push({
            text: `What is the circumference of a circle with radius 7 cm? (Use π = 3.14)`,
            options: ["43.96 cm", "21.98 cm", "153.86 cm", "43.96 cm²"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `If f(x) = 2x² - 3x + 4, what is f(2)?`,
            options: ["6", "7", "8", "9"],
            correctOptionIndex: 2
          });
        }
        
        // Add question IDs
        return questions.map((q, i) => ({
          id: `gen-${Date.now()}-${i}`,
          ...q
        }));
      };
      
      const questions = generateMockQuestions();
      setGeneratedQuestions(JSON.stringify(questions, null, 2));
      setIsGeneratingQuestions(false);
      
      toast({
        title: "Questions generated!",
        description: `Generated ${questions.length} questions for ${topic} (Grade ${grade})`,
      });
    }, 2000);
  };

  const handleCopyQuestions = () => {
    navigator.clipboard.writeText(generatedQuestions);
    toast({
      title: "Questions copied!",
      description: "The generated questions have been copied to clipboard.",
    });
  };
  
  const getQuizResultsById = (quizId: string) => {
    return results.filter(r => r.quizId === quizId);
  };
  
  const getLeaderboardEntries = (quizId: string): LeaderboardEntry[] => {
    const quizResults = getQuizResultsById(quizId);
    
    return quizResults.map(r => ({
      id: r.id,
      studentName: r.studentName,
      score: r.score,
      timeTaken: r.timeTaken,
      completedAt: r.completedAt
    }));
  };
  
  const findQuizById = (id: string): Quiz | undefined => {
    return quizzes.find(q => q.id === id);
  };
  
  const getTotalStudents = () => {
    const studentIds = new Set();
    results.forEach(r => studentIds.add(r.studentName));
    return studentIds.size;
  };
  
  const getTotalCompletions = () => {
    return results.length;
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-quiz-purple text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white text-quiz-purple font-bold rounded-lg p-2">M</div>
            <span className="font-bold text-xl">Math with Malik</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Welcome, {teacherData?.name}</span>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
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
            
            <TabsContent value="quizzes" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Math Quizzes</h2>
                <Button 
                  onClick={() => setShowQuizForm(true)}
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
                      onCopy={() => handleCopyCode(quiz.title)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-blue-50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Book className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Quizzes</p>
                      <p className="text-2xl font-bold">{quizzes.length}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Users className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="text-2xl font-bold">{getTotalStudents()}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Clock className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quiz Completions</p>
                      <p className="text-2xl font-bold">{getTotalCompletions()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Quiz Leaderboards</h3>
              
              <div className="space-y-4">
                {quizzes.length > 0 ? (
                  <div>
                    <Label htmlFor="quizSelect">Select Quiz</Label>
                    <div className="flex gap-4">
                      <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a quiz" />
                        </SelectTrigger>
                        <SelectContent>
                          {quizzes.map(quiz => (
                            <SelectItem key={quiz.id} value={quiz.id}>{quiz.title} (Grade {quiz.gradeLevel})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedQuizId && (
                      <div className="mt-4">
                        <LeaderboardComponent 
                          entries={getLeaderboardEntries(selectedQuizId)} 
                          quizTitle={findQuizById(selectedQuizId)?.title}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-quiz-light rounded-lg">
                    <p className="text-gray-500">No quiz data available yet.</p>
                    <p className="text-gray-500">Create a quiz and have students take it to see results.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="generate" className="space-y-6">
              <Card className="border-none">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">AI Math Question Generator</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="topic" className="mb-2 block">Math Topic</Label>
                        <Input
                          id="topic"
                          placeholder="E.g., Fractions, Algebra, Geometry"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="aiGradeLevel" className="mb-2 block">Grade Level</Label>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {teacherData?.grades.map(grade => (
                              <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleGenerateQuestions}
                      className="bg-quiz-teal text-white"
                      disabled={isGeneratingQuestions}
                    >
                      {isGeneratingQuestions ? "Generating Questions..." : "Generate Math Questions"}
                    </Button>
                    
                    {generatedQuestions && (
                      <div className="mt-4">
                        <Label htmlFor="generatedQuestions">Generated Questions</Label>
                        <div className="relative">
                          <Textarea
                            id="generatedQuestions"
                            className="min-h-[200px] font-mono text-sm"
                            value={generatedQuestions}
                            readOnly
                          />
                          <Button
                            className="absolute top-2 right-2 bg-quiz-purple"
                            size="sm"
                            onClick={handleCopyQuestions}
                          >
                            Copy All
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Copy these questions to use when creating a new quiz.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
      
      <footer className="bg-quiz-dark text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Math with Malik. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
