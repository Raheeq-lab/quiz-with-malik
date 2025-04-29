
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import AccessCodeCard from '@/components/AccessCodeCard';

interface TeacherData {
  id: string;
  name: string;
  email: string;
  grades: number[];
}

interface QuizClass {
  id: string;
  name: string;
  accessCode: string;
  createdAt: string;
  grade?: number;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [classes, setClasses] = useState<QuizClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState("");
  
  useEffect(() => {
    // Check if user is logged in
    const storedTeacher = localStorage.getItem('olympiadTeacher');
    
    if (!storedTeacher) {
      navigate('/teacher-signup');
      return;
    }
    
    const teacher = JSON.parse(storedTeacher);
    setTeacherData(teacher);
    
    // Load sample classes (in a real app, this would be from an API)
    const savedClasses = localStorage.getItem('olympiadClasses');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    
    setIsLoading(false);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('olympiadTeacher');
    navigate('/');
  };
  
  const generateAccessCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  const handleCreateClass = () => {
    if (!newClassName.trim()) {
      toast({
        title: "Class name required",
        description: "Please enter a name for your class.",
        variant: "destructive",
      });
      return;
    }
    
    const newClass: QuizClass = {
      id: 'class-' + Date.now(),
      name: newClassName.trim(),
      accessCode: generateAccessCode(),
      createdAt: new Date().toISOString(),
      grade: selectedGrade ? parseInt(selectedGrade) : undefined
    };
    
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    localStorage.setItem('olympiadClasses', JSON.stringify(updatedClasses));
    setNewClassName('');
    setSelectedGrade("");
    
    toast({
      title: "Class created!",
      description: `Your new class "${newClass.name}" is ready. Share the access code with your students.`,
    });
  };
  
  const handleCopyCode = (className: string) => {
    toast({
      title: "Code copied!",
      description: `The access code for "${className}" has been copied to clipboard.`,
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
        const questions = [
          {
            question: `What is the main concept of ${topic} in grade ${grade}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: "Option B"
          },
          {
            question: `Solve this ${difficultyLevel} ${topic} problem: [Example problem relevant to grade ${grade}]`,
            options: ["Solution 1", "Solution 2", "Solution 3", "Solution 4"],
            answer: "Solution 3"
          },
          {
            question: `Apply ${topic} concepts to solve: [Practical application problem]`,
            options: ["Application A", "Application B", "Application C", "Application D"],
            answer: "Application A"
          },
          {
            question: `In ${topic}, explain why [concept relevant to grade ${grade}] is important:`,
            options: ["Reason 1", "Reason 2", "Reason 3", "Reason 4"],
            answer: "Reason 2"
          },
          {
            question: `${grade > 7 ? "Advanced" : "Basic"} ${topic} question: [Grade-appropriate question]`,
            options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
            answer: "Choice 4"
          }
        ];
        
        return JSON.stringify(questions, null, 2);
      };
      
      const questions = generateMockQuestions();
      setGeneratedQuestions(questions);
      setIsGeneratingQuestions(false);
      
      toast({
        title: "Questions generated!",
        description: `Generated ${JSON.parse(questions).length} questions for ${topic} (Grade ${grade})`,
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
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-quiz-purple text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white text-quiz-purple font-bold rounded-lg p-2">O</div>
            <span className="font-bold text-xl">Olympiad by Malik</span>
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
        
        {/* Create New Class Section */}
        <section className="mb-10">
          <Card className="bg-quiz-light border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create a New Class</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="className" className="mb-2 block">Class Name</Label>
                  <Input
                    id="className"
                    placeholder="Enter class name"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="gradeLevel" className="mb-2 block">Grade Level</Label>
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
                <Button 
                  onClick={handleCreateClass}
                  className="bg-quiz-purple text-white self-end"
                >
                  Create Class
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* AI Question Generator */}
        <section className="mb-10">
          <Card className="border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">AI Question Generator</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic" className="mb-2 block">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="E.g., Fractions, Ancient Egypt, States of Matter"
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
                  {isGeneratingQuestions ? "Generating Questions..." : "Generate Questions"}
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
                      These questions can be edited and added to your quizzes.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Class List */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Your Classes</h2>
          
          {classes.length === 0 ? (
            <div className="text-center py-10 bg-quiz-light rounded-lg">
              <p className="text-gray-500">You haven't created any classes yet.</p>
              <p className="text-gray-500">Get started by creating your first class above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map(cls => (
                <AccessCodeCard
                  key={cls.id}
                  title={`${cls.name}${cls.grade ? ` (Grade ${cls.grade})` : ''}`}
                  accessCode={cls.accessCode}
                  onCopy={() => handleCopyCode(cls.name)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-quiz-dark text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Olympiad by Malik. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
