
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
        description: "Please enter both your name and the quiz code.",
        variant: "destructive",
      });
      setIsJoining(false);
      return;
    }
    
    // Check if quiz code exists (in a real app, this would be an API call to Firebase)
    const savedQuizzes = localStorage.getItem('mathWithMalikQuizzes');
    const quizzes = savedQuizzes ? JSON.parse(savedQuizzes) : [];
    const matchingQuiz = quizzes.find((q: any) => q.accessCode === accessCode.toUpperCase());
    
    if (!matchingQuiz) {
      toast({
        title: "Invalid quiz code",
        description: "The quiz code you entered doesn't match any active quiz.",
        variant: "destructive",
      });
      setIsJoining(false);
      return;
    }
    
    // Store student information for the quiz
    localStorage.setItem('mathWithMalikStudent', JSON.stringify({
      name: studentName,
      quizId: matchingQuiz.id,
      quizTitle: matchingQuiz.title,
      gradeLevel: matchingQuiz.gradeLevel,
      joinedAt: new Date().toISOString()
    }));
    
    setTimeout(() => {
      toast({
        title: "Successfully joined!",
        description: `You've joined ${matchingQuiz.title}.`,
      });
      setIsJoining(false);
      navigate('/student-quiz'); 
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-quiz-light">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Join Math Quiz</CardTitle>
            <CardDescription>
              Enter the quiz code provided by your teacher
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
                  Quiz Code
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
                {isJoining ? "Joining..." : "Start Quiz"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">How to join:</h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                <li>Enter your name so your teacher can identify you</li>
                <li>Enter the 6-digit quiz code provided by your teacher</li>
                <li>Click "Start Quiz" to begin</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentJoin;
