import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Clock, CheckCircle, XCircle, Zap, GaugeCircle } from "lucide-react";
import { QuizQuestion, StudentAnswer } from '@/types/quiz';
import { BookOpen, BookText, Laptop } from "lucide-react";
import PowerMeter from '@/components/PowerMeter';

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
  
  // Power meter state
  const [power, setPower] = useState(50); // Starting power at 50%
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const maxPower = 100;
  
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

  // Get color based on subject
  const getSubjectColor = () => {
    if (!quiz || !quiz.subject) return {};

    switch (quiz.subject) {
      case "math":
        return {
          header: "bg-purple-100",
          button: "bg-purple-600 hover:bg-purple-700",
          selected: "border-purple-500 bg-purple-50",
          text: "text-purple-500",
          completed: "text-purple-600"
        };
      case "english":
        return {
          header: "bg-green-100",
          button: "bg-green-600 hover:bg-green-700",
          selected: "border-green-500 bg-green-50",
          text: "text-green-500",
          completed: "text-green-600"
        };
      case "ict":
        return {
          header: "bg-orange-100",
          button: "bg-orange-600 hover:bg-orange-700",
          selected: "border-orange-500 bg-orange-50",
          text: "text-orange-500",
          completed: "text-orange-600"
        };
      default:
        return {
          header: "bg-quiz-light",
          button: "bg-quiz-purple",
          selected: "border-quiz-purple bg-quiz-purple/10",
          text: "text-quiz-purple",
          completed: "text-quiz-purple"
        };
    }
  };

  const getSubjectIcon = () => {
    if (!quiz || !quiz.subject) return null;

    const colors = getSubjectColor();
    
    switch (quiz.subject) {
      case "math": return <BookOpen size={16} className={colors.text} />;
      case "english": return <BookText size={16} className={colors.text} />;
      case "ict": return <Laptop size={16} className={colors.text} />;
      default: return <BookOpen size={16} className={colors.text} />;
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  // Motivation messages based on power level
  const getMotivationMessage = (power: number): string => {
    if (power >= 90) return "Incredible! You're unstoppable!";
    if (power >= 75) return "Amazing! Keep up the great work!";
    if (power >= 50) return "You're doing well! Keep going!";
    if (power >= 25) return "You can do better! Focus!";
    return "Don't give up! Every question is a new chance!";
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    // Save answer
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    
    // Update power based on answer
    const powerChange = isCorrect ? 10 : -5;
    const newPower = Math.max(0, Math.min(maxPower, power + powerChange));
    
    // Set feedback message
    const feedbackMsg = isCorrect 
      ? `Correct! +10 Power! ${getMotivationMessage(newPower)}` 
      : `Incorrect! -5 Power. ${getMotivationMessage(newPower)}`;
    
    setFeedbackMessage(feedbackMsg);
    setShowFeedback(true);
    setIsAnimating(true);
    
    // Update power with animation
    setPower(newPower);
    
    // Play sound effect (will be silent if browser blocks autoplay)
    const sound = new Audio(isCorrect ? '/correct-sound.mp3' : '/incorrect-sound.mp3');
    sound.volume = 0.5;
    sound.play().catch(() => {}); // Catch and ignore autoplay errors
    
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
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
      setIsAnimating(false);
      
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
    }, 2000);
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
      answers: finalAnswers,
      finalPower: power // Save the final power level
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

  const colors = getSubjectColor();

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-quiz-light">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="py-6">
              <div className={`text-6xl font-bold mb-2 ${colors.completed}`}>{score}/{quiz?.questions.length}</div>
              <p className="text-gray-500">Your Score</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-gray-600">Time taken: {formatTime(Math.floor((Date.now() - startTime) / 1000))}</p>
                <p className="text-gray-600">Questions answered correctly: {score}</p>
                <p className="text-gray-600">Accuracy: {Math.round((score / quiz?.questions.length) * 100)}%</p>
                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Final Power Level:</p>
                  <PowerMeter power={power} animate={false} />
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="font-semibold mb-2">Leaderboard Rank</p>
                <div className="flex items-center justify-center gap-2 text-xl">
                  <Zap size={24} className="text-yellow-500" />
                  <span className="font-bold">
                    {power >= 80 ? "Superstar!" : power >= 60 ? "Champion!" : power >= 40 ? "Rising Star!" : "Beginner"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className={`w-full ${colors.button}`}
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
      <header className={`shadow-sm p-4 ${colors.header}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className={`text-xl font-semibold flex items-center gap-2 ${colors.text}`}>
              {getSubjectIcon()}
              {quiz?.title}
            </h1>
            <p className="text-gray-500 text-sm">
              Grade {quiz?.gradeLevel} • Question {currentQuestionIndex + 1} of {quiz?.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
            <Clock size={16} className={colors.text} />
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <div className="w-full mb-4">
              <PowerMeter power={power} animate={isAnimating} showIcon={true} />
            </div>
            
            {showFeedback && feedbackMessage && (
              <div className={`p-3 rounded-lg mb-4 text-center animate-fade-in ${
                feedbackMessage.includes("Correct") 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {feedbackMessage.includes("Correct") 
                    ? <CheckCircle size={18} className="text-green-600" /> 
                    : <XCircle size={18} className="text-red-600" />
                  }
                  <p className="font-medium">{feedbackMessage}</p>
                </div>
              </div>
            )}
            
            <CardTitle className="text-xl">
              {currentQuestion?.text}
            </CardTitle>
            {currentQuestion?.imageUrl && (
              <div className="mt-4">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Question illustration" 
                  className="mx-auto max-h-60 rounded-md border border-gray-200"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                    selectedOption === index 
                      ? colors.selected
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
                      selectedOption === index ? colors.button + " text-white" : 'bg-gray-100'
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
              disabled={selectedOption === null || showFeedback}
              className={colors.button}
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
