
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { QuizQuestion, StudentAnswer } from '@/types/quiz';

interface StudentData {
  name: string;
  quizId: string;
  quizTitle: string;
  gradeLevel: number;
}

const StudentQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());
  
  // Load student data and quiz
  useEffect(() => {
    const loadData = async () => {
      // Get student data
      const storedStudentData = localStorage.getItem('mathWithMalikStudent');
      if (!storedStudentData) {
        toast({
          title: "Error",
          description: "No student data found. Please join the quiz again.",
          variant: "destructive",
        });
        navigate('/student-join');
        return;
      }

      const student = JSON.parse(storedStudentData);
      setStudentData(student);
      
      // Get quiz data (in a real app, this would be an API call to Firebase)
      const storedQuizzes = localStorage.getItem('mathWithMalikQuizzes');
      if (!storedQuizzes) {
        toast({
          title: "Error",
          description: "No quiz data found. Please contact your teacher.",
          variant: "destructive",
        });
        navigate('/student-join');
        return;
      }

      const quizzes = JSON.parse(storedQuizzes);
      const matchingQuiz = quizzes.find((q: any) => q.id === student.quizId);
      
      if (!matchingQuiz) {
        toast({
          title: "Error",
          description: "Quiz not found. Please contact your teacher.",
          variant: "destructive",
        });
        navigate('/student-join');
        return;
      }

      setQuiz(matchingQuiz);
      setTimeLeft(matchingQuiz.timeLimit || 30); // Default 30 seconds per question if not specified
      setIsLoading(false);
    };

    loadData();
  }, [navigate, toast]);

  // Timer effect
  useEffect(() => {
    if (isLoading || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up for this question, move to the next
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, quizCompleted, currentQuestionIndex]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    // Save answer
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    
    const answer: StudentAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: selectedOption,
      isCorrect: isCorrect,
      timeTaken: quiz.timeLimit - timeLeft
    };
    
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Check if this was the last question
    if (currentQuestionIndex === quiz.questions.length - 1) {
      // Quiz completed
      completeQuiz(updatedAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(quiz.timeLimit || 30);
    }
  };
  
  const completeQuiz = (finalAnswers: StudentAnswer[]) => {
    setQuizCompleted(true);
    
    const totalTimeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // In a real app, this would be saved to Firebase
    const quizResult = {
      id: `result-${Date.now()}`,
      studentName: studentData?.name || "Unknown Student",
      quizId: quiz.id,
      score: finalAnswers.filter(a => a.isCorrect).length,
      totalQuestions: quiz.questions.length,
      timeTaken: totalTimeTaken,
      completedAt: new Date().toISOString(),
      answers: finalAnswers
    };
    
    // Store results
    const storedResults = localStorage.getItem('mathWithMalikResults') || '[]';
    const results = JSON.parse(storedResults);
    results.push(quizResult);
    localStorage.setItem('mathWithMalikResults', JSON.stringify(results));
    
    toast({
      title: "Quiz completed!",
      description: `Your score: ${quizResult.score}/${quizResult.totalQuestions}`,
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-light">
        <div className="text-center">
          <p className="text-xl">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-quiz-light">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="py-6">
              <div className="text-6xl font-bold text-quiz-purple mb-2">{score}/{quiz?.questions.length}</div>
              <p className="text-gray-500">Your Score</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-gray-600">Time taken: {formatTime(Math.floor((Date.now() - startTime) / 1000))}</p>
                <p className="text-gray-600">Questions answered correctly: {score}</p>
                <p className="text-gray-600">Accuracy: {Math.round((score / quiz?.questions.length) * 100)}%</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-quiz-purple" 
              onClick={() => navigate('/student-join')}
            >
              Join Another Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex] as QuizQuestion;

  return (
    <div className="min-h-screen flex flex-col bg-quiz-light">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-quiz-purple">
              {quiz?.title}
            </h1>
            <p className="text-gray-500 text-sm">
              Grade {quiz?.gradeLevel} • Question {currentQuestionIndex + 1} of {quiz?.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-quiz-light rounded-full">
            <Clock size={16} className="text-quiz-purple" />
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion?.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                    selectedOption === index 
                      ? 'border-quiz-purple bg-quiz-purple/10' 
                      : 'border-gray-200 hover:border-quiz-purple/50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
                      selectedOption === index ? 'bg-quiz-purple text-white' : 'bg-gray-100'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                Student: {studentData?.name}
              </p>
            </div>
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="bg-quiz-purple"
            >
              {currentQuestionIndex === quiz?.questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default StudentQuiz;
