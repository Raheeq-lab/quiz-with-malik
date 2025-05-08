
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, BookText, Laptop } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SubjectSelector from '@/components/SubjectSelector';
import { Quiz } from '@/types/quiz';

const StudentJoin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>("math");
  const [isJoining, setIsJoining] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  
  // Load quizzes on component mount
  useEffect(() => {
    const loadQuizzes = () => {
      try {
        const quizzesString = localStorage.getItem('mathWithMalikQuizzes');
        if (quizzesString) {
          const loadedQuizzes = JSON.parse(quizzesString);
          setAvailableQuizzes(loadedQuizzes);
          
          if (loadedQuizzes.length > 0) {
            setDebugInfo(`Loaded ${loadedQuizzes.length} quizzes. Available codes: ${loadedQuizzes.map((q: any) => q.accessCode || 'no-code').join(', ')}`);
            console.log("Available quizzes:", loadedQuizzes);
          } else {
            setDebugInfo("No quizzes found in localStorage");
          }
        } else {
          setDebugInfo("No quizzes found in localStorage (key not found)");
        }
      } catch (error) {
        console.error("Error loading quizzes:", error);
        setDebugInfo(`Error loading quizzes: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    loadQuizzes();
  }, []);
  
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
    
    // Clean up the access code
    const cleanAccessCode = accessCode.trim().toUpperCase();
    console.log("Attempting to join with clean code:", cleanAccessCode);
    
    // Debug information
    console.log("All available quizzes:", availableQuizzes);
    console.log("Available access codes:", availableQuizzes.map(q => q.accessCode?.trim()?.toUpperCase()));
    
    setTimeout(() => {
      setIsJoining(false);
      
      // Find quiz with matching access code regardless of subject
      const quiz = availableQuizzes.find(q => 
        q.accessCode && q.accessCode.trim().toUpperCase() === cleanAccessCode
      );
      
      console.log("Quiz match found:", quiz ? "Yes" : "No");
      
      // Get lessons from local storage
      const lessonsString = localStorage.getItem('mathWithMalikLessons');
      let lessons = [];
      
      try {
        lessons = lessonsString ? JSON.parse(lessonsString) : [];
      } catch (error) {
        console.error("Error parsing lessons:", error);
        lessons = [];
      }
      
      // Find lesson with matching access code
      const lesson = lessons.find((l: any) => 
        l.accessCode && l.accessCode.trim().toUpperCase() === cleanAccessCode
      );
      
      if (quiz) {
        // Confirm the quiz has questions
        if (!quiz.questions || quiz.questions.length === 0) {
          toast({
            title: "Quiz has no questions",
            description: "This quiz doesn't contain any questions. Please contact your teacher.",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Joining quiz:", quiz.title, "ID:", quiz.id);
        
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
        
        toast({
          title: "Feature Coming Soon",
          description: "The lesson view is currently being developed.",
        });
      } else {
        // Debug information for troubleshooting
        const availableCodes = availableQuizzes.map(q => q.accessCode?.trim()?.toUpperCase() || 'no-code');
        
        setDebugInfo(`No match for: "${cleanAccessCode}". Available: ${availableCodes.join(', ')}`);
        
        toast({
          title: "Invalid access code",
          description: "No quiz or lesson found with this access code. Please check and try again.",
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
                  className="tracking-widest text-center uppercase font-mono"
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
            
            <CardFooter className="flex-col gap-4">
              <Button 
                type="submit" 
                className={`w-full ${getSubjectColor()}`}
                disabled={isJoining}
              >
                {isJoining ? 'Joining...' : 'Join Now'}
              </Button>
              
              {/* Quiz list for debugging */}
              {debugInfo && (
                <div className="w-full p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                  <p className="font-semibold text-xs">Debug Info:</p>
                  <p className="text-xs font-mono break-all">{debugInfo}</p>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default StudentJoin;
