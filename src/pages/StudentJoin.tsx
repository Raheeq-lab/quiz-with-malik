
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';

const StudentJoin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    
    if (!accessCode.trim() || !studentName.trim()) {
      toast({
        title: "Information required",
        description: "Please enter both your name and the access code.",
        variant: "destructive",
      });
      setIsJoining(false);
      return;
    }
    
    // Check if access code exists (in a real app, this would be an API call)
    const savedClasses = localStorage.getItem('quizHubClasses');
    const classes = savedClasses ? JSON.parse(savedClasses) : [];
    const matchingClass = classes.find((c: any) => c.accessCode === accessCode.toUpperCase());
    
    if (!matchingClass) {
      toast({
        title: "Invalid access code",
        description: "The access code you entered doesn't match any active class.",
        variant: "destructive",
      });
      setIsJoining(false);
      return;
    }
    
    // Store student information
    localStorage.setItem('quizHubStudent', JSON.stringify({
      name: studentName,
      classId: matchingClass.id,
      className: matchingClass.name,
      joinedAt: new Date().toISOString()
    }));
    
    setTimeout(() => {
      toast({
        title: "Successfully joined!",
        description: `You've joined ${matchingClass.name}.`,
      });
      setIsJoining(false);
      navigate('/student-quiz'); // In a real app, this would navigate to the quiz interface
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-quiz-light">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Join a Quiz</CardTitle>
            <CardDescription>
              Enter the access code provided by your teacher
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="studentName" className="block text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="studentName"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="accessCode" className="block text-sm font-medium">
                  Access Code
                </label>
                <Input
                  id="accessCode"
                  placeholder="Enter the 6-digit code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="access-code text-center text-lg"
                  maxLength={6}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-quiz-teal hover:bg-opacity-90"
                disabled={isJoining}
              >
                {isJoining ? "Joining..." : "Join Quiz"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">How to join:</h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                <li>Enter your name so your teacher knows who you are</li>
                <li>Enter the 6-digit code provided by your teacher</li>
                <li>Click "Join Quiz" to enter the classroom</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentJoin;
