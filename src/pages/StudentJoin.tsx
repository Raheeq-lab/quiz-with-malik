import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, BookText, Laptop } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SubjectSelector from '@/components/SubjectSelector';

const StudentJoin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>("math");
  const [isJoining, setIsJoining] = useState(false);
  
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to join the quiz.",
        variant: "destructive",
      });
      return;
    }

    if (!accessCode.trim()) {
      toast({
        title: "Access code required",
        description: "Please enter the quiz access code provided by your teacher.",
        variant: "destructive",
      });
      return;
    }
    
    setIsJoining(true);
    
    // Get all quizzes from local storage
    const quizzesString = localStorage.getItem('mathWithMalikQuizzes');
    let quizzes = [];
    
    try {
      quizzes = quizzesString ? JSON.parse(quizzesString) : [];
      console.log("Found quizzes:", quizzes.length);
      console.log("Looking for access code:", accessCode);
      
      // Debug all available access codes
      if (quizzes.length > 0) {
        console.log("Available access codes:", quizzes.map((q: any) => q.accessCode));
      }
    } catch (error) {
      console.error("Error parsing quizzes:", error);
      quizzes = [];
    }
    
    setTimeout(() => {
      setIsJoining(false);
      
      // Find quiz with matching access code regardless of subject
      // Using trim() to ensure no whitespace issues and making case-insensitive comparison
      const quiz = quizzes.find((q: any) => 
        q.accessCode && q.accessCode.trim().toUpperCase() === accessCode.trim().toUpperCase()
      );
      
      console.log("Quiz found:", quiz ? "Yes" : "No");
      
      // Get lessons from local storage
      const lessonsString = localStorage.getItem('mathWithMalikLessons');
      let lessons = [];
      
      try {
        lessons = lessonsString ? JSON.parse(lessonsString) : [];
      } catch (error) {
        console.error("Error parsing lessons:", error);
        lessons = [];
      }
      
      // Find lesson with matching access code regardless of subject
      // Using same whitespace and case-insensitive comparison
      const lesson = lessons.find((l: any) => 
        l.accessCode && l.accessCode.trim().toUpperCase() === accessCode.trim().toUpperCase()
      );
      
      if (quiz) {
        // Store student data
        const studentData = {
          name: name,
          quizId: quiz.id,
          quizTitle: quiz.title,
          gradeLevel: quiz.gradeLevel,
          subject: quiz.subject
        };
        
        localStorage.setItem('mathWithMalikStudent', JSON.stringify(studentData));
        
        toast({
          title: "Quiz joined!",
          description: `Welcome to ${quiz.title}. Good luck!`,
        });
        
        navigate('/student-quiz');
      } else if (lesson) {
        // Store student data for lesson
        const studentData = {
          name: name,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          gradeLevel: lesson.gradeLevel,
          subject: lesson.subject
        };
        
        localStorage.setItem('mathWithMalikStudent', JSON.stringify(studentData));
        
        toast({
          title: "Lesson joined!",
          description: `Welcome to ${lesson.title}. Let's learn!`,
        });
        
        // For now, navigate to the same page since we haven't implemented the lesson view
        toast({
          title: "Feature Coming Soon",
          description: "The lesson view is currently being developed.",
        });
      } else {
        // For debugging, log additional info about what was searched
        console.log("Access code comparison failed:", {
          enteredCode: accessCode,
          quizCount: quizzes.length,
          lessonCount: lessons.length
        });
        
        toast({
          title: "Invalid access code",
          description: `No content found with this access code. Please check and try again.`,
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const getSubjectIcon = () => {
    switch (selectedSubject) {
      case "math": return <BookOpen size={24} className="text-purple-500" />;
      case "english": return <BookText size={24} className="text-green-500" />;
      case "ict": return <Laptop size={24} className="text-orange-500" />;
      default: return <BookOpen size={24} className="text-purple-500" />;
    }
  };

  const getSubjectColor = () => {
    switch (selectedSubject) {
      case "math": return "bg-purple-600 hover:bg-purple-700";
      case "english": return "bg-green-600 hover:bg-green-700";
      case "ict": return "bg-orange-600 hover:bg-orange-700";
      default: return "bg-purple-600 hover:bg-purple-700";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getSubjectIcon()}
            </div>
            <CardTitle className="text-2xl gradient-text">Join a Quiz or Lesson</CardTitle>
            <CardDescription>
              Enter your name and the access code to join
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleJoin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  placeholder="Enter 6-digit code (e.g., ABC123)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  required
                  maxLength={6}
                  className="tracking-widest text-center uppercase"
                />
                <p className="text-xs text-gray-500">
                  The 6-letter code provided by your teacher
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Preferred Subject</Label>
                <SubjectSelector
                  selectedSubject={selectedSubject}
                  onChange={setSelectedSubject}
                />
                <p className="text-xs text-gray-500">
                  Note: You can join any quiz with the correct access code
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className={`w-full ${getSubjectColor()}`}
                disabled={isJoining}
              >
                {isJoining ? 'Joining...' : 'Join Now'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default StudentJoin;
