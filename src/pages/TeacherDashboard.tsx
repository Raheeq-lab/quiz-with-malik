
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AccessCodeCard from '@/components/AccessCodeCard';

interface TeacherData {
  id: string;
  name: string;
  email: string;
}

interface QuizClass {
  id: string;
  name: string;
  accessCode: string;
  createdAt: string;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [classes, setClasses] = useState<QuizClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const storedTeacher = localStorage.getItem('quizHubTeacher');
    
    if (!storedTeacher) {
      navigate('/teacher-signup');
      return;
    }
    
    const teacher = JSON.parse(storedTeacher);
    setTeacherData(teacher);
    
    // Load sample classes (in a real app, this would be from an API)
    const savedClasses = localStorage.getItem('quizHubClasses');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    
    setIsLoading(false);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('quizHubTeacher');
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
    };
    
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    localStorage.setItem('quizHubClasses', JSON.stringify(updatedClasses));
    setNewClassName('');
    
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
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-quiz-purple text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white text-quiz-purple font-bold rounded-lg p-2">Q</div>
            <span className="font-bold text-xl">QuizHub</span>
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
                  title={cls.name}
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
          <p>&copy; {new Date().getFullYear()} QuizHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
