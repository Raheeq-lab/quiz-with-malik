import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  X, Plus, Trash2, Image, Upload, FileText, BookOpen, Laptop, 
  BookText, Brain, BarChart2, Gamepad2, BriefcaseBusiness, MessageSquare, 
  Pen, Headphones, Pencil, Search, Play, MousePointer, CheckSquare, FileUp, 
  Video, ArrowLeft, Activity, Timer, Star, Users, Gamepad
} from "lucide-react";
import { Lesson, LessonContent, ActivitySettings, TeamInfo, GameQuestion } from '@/types/quiz';
import SubjectSelector from '@/components/SubjectSelector';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ActivitySection from './ActivitySection';

interface LearningTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface LessonBuilderProps {
  grades: number[];
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
  subject: "math" | "english" | "ict";
}

const generateAccessCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const initialContent: LessonContent = {
  id: `content-${Date.now()}`,
  type: 'text',
  content: '',
};

const EMOJI_OPTIONS = ["😀", "🚀", "🔥", "⭐", "🎯", "🎮", "🏆", "🎨", "🎭", "🎪", "🎢", "🎡"];
const COLOR_OPTIONS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
];

// Add new game types
const GAME_TYPES = [
  {
    id: "quiz",
    title: "Quiz Game",
    description: "Traditional quiz with multiple questions and answers"
  },
  {
    id: "grid",
    title: "Grid Game",
    description: "Interactive grid where teams select numbers to reveal questions"
  }
];

// Helper function to get subject color class
const getSubjectColorClass = (subject: "math" | "english" | "ict") => {
  switch (subject) {
    case "math": return "text-purple-600";
    case "english": return "text-green-600";
    case "ict": return "text-orange-600";
    default: return "text-blue-600";
  }
};

const LessonBuilder: React.FC<LessonBuilderProps> = ({ grades, onSave, onCancel, subject = "math" }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentBlocks, setContentBlocks] = useState<LessonContent[]>([initialContent]);
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number>(grades[0] || 1);

  // New game activity state
  const [gameQuestions, setGameQuestions] = useState<{
    id: string;
    text: string;
    imageUrl?: string;
    options?: string[];
    correctOption?: number;
    points: number;
    type: 'text' | 'image' | 'multiple-choice';
  }[]>([]);

  const getLearningTypes = (): LearningTypeOption[] => {
    switch (subject) {
      case "math":
        return [
          {
            id: "problem-solving",
            title: "Problem Solving Practice",
            description: "Solve step-by-step math problems to build logic and accuracy.",
            icon: <Brain className="text-purple-600" />
          },
          {
            id: "visual-interactive",
            title: "Visual & Interactive Learning",
            description: "Learn through graphs, number lines, and drag-and-drop tools.",
            icon: <BarChart2 className="text-purple-600" />
          },
          {
            id: "game-based",
            title: "Game-Based Quizzes",
            description: "Practice with fun, timed challenges and scoring levels.",
            icon: <Gamepad2 className="text-purple-600" />
          },
          {
            id: "real-world",
            title: "Real-World Application",
            description: "Apply math in budgeting, measuring, and real-life scenarios.",
            icon: <BriefcaseBusiness className="text-purple-600" />
          },
          {
            id: "math-talks",
            title: "Math Talks",
            description: "Explain your solution strategy or compare methods with others.",
            icon: <MessageSquare className="text-purple-600" />
          }
        ];
      case "english":
        return [
          {
            id: "reading-comprehension",
            title: "Reading Comprehension",
            description: "Read passages and answer questions to build understanding.",
            icon: <FileText className="text-green-600" />
          },
          {
            id: "grammar-practice",
            title: "Grammar Practice",
            description: "Work on punctuation, sentence structure, and parts of speech.",
            icon: <Pen className="text-green-600" />
          },
          {
            id: "picture-based",
            title: "Picture-Based Writing",
            description: "Describe or create stories from a visual prompt.",
            icon: <Image className="text-green-600" />
          },
          {
            id: "speaking-listening",
            title: "Speaking & Listening",
            description: "Record spoken answers or respond after watching a clip.",
            icon: <Headphones className="text-green-600" />
          },
          {
            id: "creative-expression",
            title: "Creative Expression",
            description: "Write stories, letters, and journal entries using prompts.",
            icon: <Pencil className="text-green-600" />
          }
        ];
      case "ict":
        return [
          {
            id: "identify-label",
            title: "Identify & Label",
            description: "Name parts of computers, software, or interfaces using images.",
            icon: <Search className="text-orange-600" />
          },
          {
            id: "watch-demonstrate",
            title: "Watch & Demonstrate",
            description: "Watch a task-based video and complete the digital activity.",
            icon: <Play className="text-orange-600" />
          },
          {
            id: "digital-tool",
            title: "Digital Tool Use",
            description: "Practice using basic apps (e.g., Word, Paint, Scratch).",
            icon: <MousePointer className="text-orange-600" />
          },
          {
            id: "concept-check",
            title: "Concept Check Quizzes",
            description: "Answer questions about ICT theory and digital safety.",
            icon: <CheckSquare className="text-orange-600" />
          },
          {
            id: "create-submit",
            title: "Create & Submit",
            description: "Upload original work like a document, design, or code snippet.",
            icon: <FileUp className="text-orange-600" />
          }
        ];
      default:
        return [];
    }
  };

  const getSuggestedContentBlocks = (learningTypeId: string): LessonContent[] => {
    switch (learningTypeId) {
      case "problem-solving":
        return [
          { id: `content-${Date.now()}-1`, type: 'text', content: 'Problem Statement:' },
          { id: `content-${Date.now()}-2`, type: 'text', content: 'Step-by-step approach:' }
        ];
      case "visual-interactive":
        return [
          { id: `content-${Date.now()}-1`, type: 'text', content: 'Introduction:' },
          { id: `content-${Date.now()}-2`, type: 'image', content: 'Visual representation' },
          { id: `content-${Date.now()}-3`, type: 'dragAndDrop', content: 'Interactive elements:' }
        ];
      case "picture-based":
        return [
          { id: `content-${Date.now()}-1`, type: 'text', content: 'Writing prompt:' },
          { id: `content-${Date.now()}-2`, type: 'imageWithPrompt', content: '' }
        ];
      case "identify-label":
        return [
          { id: `content-${Date.now()}-1`, type: 'text', content: 'Instructions:' },
          { id: `content-${Date.now()}-2`, type: 'labeling', content: 'Label the components:' }
        ];
      case "watch-demonstrate":
        return [
          { id: `content-${Date.now()}-1`, type: 'text', content: 'Watch the following video:' },
          { id: `content-${Date.now()}-2`, type: 'video', content: 'Video demonstration' }
        ];
      default:
        return [initialContent];
    }
  };
  
  const handleActivityTypeChange = (index: number, activityType: "teacher-led" | "print-practice" | "student-devices" | "game") => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity') return block;
      
      let updatedActivity = {
        ...(block.activity || { 
          activityType: "teacher-led", 
          teamMode: { enabled: false }, 
          scoring: { enabled: false } 
        }),
        activityType
      };
      
      // Initialize game-specific settings if switching to game activity
      if (activityType === "game") {
        updatedActivity = {
          ...updatedActivity,
          gameTitle: "Fun Quiz Game",
          gameType: "quiz", // Default to quiz game type
          gameQuestions: [
            {
              id: `question-${Date.now()}-0`,
              text: '',
              points: 10,
              type: 'text'
            },
            {
              id: `question-${Date.now()}-1`,
              text: '',
              points: 10,
              type: 'text'
            },
            {
              id: `question-${Date.now()}-2`,
              text: '',
              points: 20,
              type: 'text'
            },
            {
              id: `question-${Date.now()}-3`,
              text: '',
              points: 20,
              type: 'text'
            }
          ],
          gameSettings: {
            randomizeQuestions: true,
            timerEnabled: false,
            timerDuration: 30,
            gridSize: 3 // 3x3 default grid size for grid games
          },
          // Ensure team mode is enabled for games
          teamMode: {
            enabled: true,
            numberOfTeams: 2,
            teams: [
              {
                id: `team-${Date.now()}-0`,
                name: "Team 1",
                color: COLOR_OPTIONS[0],
                emoji: EMOJI_OPTIONS[0],
                score: 0
              },
              {
                id: `team-${Date.now()}-1`,
                name: "Team 2",
                color: COLOR_OPTIONS[1],
                emoji: EMOJI_OPTIONS[1],
                score: 0
              }
            ]
          }
        };
      }
      
      return {
        ...block,
        activity: updatedActivity
      };
    }));
  };

  const handleTeamModeToggle = (index: number, enabled: boolean) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity') return block;
      
      // Initialize teams if enabling team mode
      let teams: TeamInfo[] | undefined = block.activity?.teamMode?.teams;
      
      if (enabled && (!teams || teams.length === 0)) {
        const numberOfTeams = block.activity?.teamMode?.numberOfTeams || 3;
        teams = Array.from({ length: numberOfTeams }, (_, teamIndex) => ({
          id: `team-${Date.now()}-${teamIndex}`,
          name: `Team ${teamIndex + 1}`,
          color: COLOR_OPTIONS[teamIndex % COLOR_OPTIONS.length],
          emoji: EMOJI_OPTIONS[teamIndex % EMOJI_OPTIONS.length]
        }));
      }
      
      return {
        ...block,
        activity: {
          ...(block.activity || { 
            activityType: "teacher-led", 
            teamMode: { enabled: false }, 
            scoring: { enabled: false } 
          }),
          teamMode: {
            enabled,
            numberOfTeams: block.activity?.teamMode?.numberOfTeams || 3,
            teams
          }
        }
      };
    }));
  };
  
  const handleNumberOfTeamsChange = (index: number, numberOfTeams: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity') return block;
      
      // Adjust teams array based on new number
      const currentTeams = block.activity?.teamMode?.teams || [];
      let newTeams = [...currentTeams];
      
      if (numberOfTeams > currentTeams.length) {
        // Add more teams
        for (let j = currentTeams.length; j < numberOfTeams; j++) {
          newTeams.push({
            id: `team-${Date.now()}-${j}`,
            name: `Team ${j + 1}`,
            color: COLOR_OPTIONS[j % COLOR_OPTIONS.length],
            emoji: EMOJI_OPTIONS[j % EMOJI_OPTIONS.length]
          });
        }
      } else if (numberOfTeams < currentTeams.length) {
        // Remove teams
        newTeams = newTeams.slice(0, numberOfTeams);
      }
      
      return {
        ...block,
        activity: {
          ...(block.activity || { 
            activityType: "teacher-led", 
            teamMode: { enabled: false }, 
            scoring: { enabled: false } 
          }),
          teamMode: {
            ...block.activity?.teamMode,
            numberOfTeams,
            teams: newTeams
          }
        }
      };
    }));
  };
  
  const handleTeamNameChange = (index: number, teamIndex: number, name: string) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || !block.activity?.teamMode?.teams) return block;
      
      const newTeams = [...block.activity.teamMode.teams];
      if (newTeams[teamIndex]) {
        newTeams[teamIndex] = { ...newTeams[teamIndex], name };
      }
      
      return {
        ...block,
        activity: {
          ...block.activity,
          teamMode: {
            ...block.activity.teamMode,
            teams: newTeams
          }
        }
      };
    }));
  };
  
  const handleTeamEmojiChange = (index: number, teamIndex: number, emoji: string) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || !block.activity?.teamMode?.teams) return block;
      
      const newTeams = [...block.activity.teamMode.teams];
      if (newTeams[teamIndex]) {
        newTeams[teamIndex] = { ...newTeams[teamIndex], emoji };
      }
      
      return {
        ...block,
        activity: {
          ...block.activity,
          teamMode: {
            ...block.activity.teamMode,
            teams: newTeams
          }
        }
      };
    }));
  };
  
  const handleTeamColorChange = (index: number, teamIndex: number, color: string) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || !block.activity?.teamMode?.teams) return block;
      
      const newTeams = [...block.activity.teamMode.teams];
      if (newTeams[teamIndex]) {
        newTeams[teamIndex] = { ...newTeams[teamIndex], color };
      }
      
      return {
        ...block,
        activity: {
          ...block.activity,
          teamMode: {
            ...block.activity.teamMode,
            teams: newTeams
          }
        }
      };
    }));
  };

  const handleScoringToggle = (index: number, enabled: boolean) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity') return block;
      
      return {
        ...block,
        activity: {
          ...(block.activity || { 
            activityType: "teacher-led", 
            teamMode: { enabled: false }, 
            scoring: { enabled: false } 
          }),
          scoring: {
            enabled,
            type: block.activity?.scoring?.type || "points"
          }
        }
      };
    }));
  };
  
  const handleScoringTypeChange = (index: number, type: "points" | "badges") => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity') return block;
      
      return {
        ...block,
        activity: {
          ...(block.activity || { 
            activityType: "teacher-led", 
            teamMode: { enabled: false }, 
            scoring: { enabled: false } 
          }),
          scoring: {
            ...block.activity.scoring,
            type
          }
        }
      };
    }));
  };

  const handleAddGameQuestion = (index: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      // Get current questions from block or initialize
      const currentQuestions = block.activity?.gameQuestions || [];
      
      // Add new question
      const newQuestion = {
        id: `question-${Date.now()}-${currentQuestions.length}`,
        text: '',
        points: 10,
        type: 'text' as const
      };
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameQuestions: [...currentQuestions, newQuestion]
        }
      };
    }));
  };
  
  const handleRemoveGameQuestion = (contentIndex: number, questionIndex: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      const updatedQuestions = (block.activity?.gameQuestions || []).filter((_, qIndex) => qIndex !== questionIndex);
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameQuestions: updatedQuestions
        }
      };
    }));
  };
  
  const handleGameQuestionChange = (contentIndex: number, questionIndex: number, field: string, value: any) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      const updatedQuestions = (block.activity?.gameQuestions || []).map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        return { ...question, [field]: value };
      });
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameQuestions: updatedQuestions
        }
      };
    }));
  };
  
  const handleGameQuestionTypeChange = (contentIndex: number, questionIndex: number, type: 'text' | 'image' | 'multiple-choice') => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      const updatedQuestions = (block.activity?.gameQuestions || []).map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        
        // Initialize options array if changing to multiple choice
        const options = type === 'multiple-choice' ? 
          question.options || ['', '', '', ''] : 
          question.options;
        
        return { 
          ...question, 
          type,
          options
        };
      });
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameQuestions: updatedQuestions
        }
      };
    }));
  };
  
  const handleGameQuestionOptionChange = (contentIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      const updatedQuestions = (block.activity?.gameQuestions || []).map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        
        const options = [...(question.options || [])];
        options[optionIndex] = value;
        
        return { ...question, options };
      });
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameQuestions: updatedQuestions
        }
      };
    }));
  };
  
  const handleGameQuestionCorrectOptionChange = (contentIndex: number, questionIndex: number, correctOption: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      const updatedQuestions = (block.activity?.gameQuestions || []).map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        
        return { ...question, correctOption };
      });
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameQuestions: updatedQuestions
        }
      };
    }));
  };
  
  const handleGameTimerToggle = (index: number, enabled: boolean) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameSettings: {
            ...(block.activity.gameSettings || {}),
            timerEnabled: enabled
          }
        }
      };
    }));
  };
  
  const handleGameTimerDurationChange = (index: number, duration: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameSettings: {
            ...(block.activity.gameSettings || {}),
            timerDuration: duration
          }
        }
      };
    }));
  };

  const handleGameQuestionImageUpload = (contentIndex: number, questionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleGameQuestionChange(contentIndex, questionIndex, 'imageUrl', base64);
    };
    reader.readAsDataURL(file);
  };

  // New handler for game type change
  const handleGameTypeChange = (index: number, gameType: "quiz" | "grid") => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameType
        }
      };
    }));
  };

  // New handler for grid size change
  const handleGridSizeChange = (index: number, gridSize: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== index || block.type !== 'activity' || block.activity?.activityType !== 'game') return block;
      
      return {
        ...block,
        activity: {
          ...block.activity,
          gameSettings: {
            ...(block.activity.gameSettings || {}),
            gridSize
          }
        }
      };
    }));
  };

  const handleLearningTypeChange = (typeId: string) => {
    setSelectedLearningType(typeId);
    
    // Update content blocks with suggested template based on learning type
    if (typeId) {
      setContentBlocks(getSuggestedContentBlocks(typeId));
    }
  };
  
  const handleAddContent = (type: LessonContent['type']) => {
    let newContent: LessonContent = {
      id: `content-${Date.now()}-${contentBlocks.length}`,
      type,
      content: '',
    };

    if (type === 'activity') {
      // Initialize activity settings for activity content type
      newContent.activity = {
        activityType: "teacher-led",
        teamMode: {
          enabled: false
        },
        scoring: {
          enabled: false
        }
      };
    } else if (type === 'imageWithPrompt' || type === 'dragAndDrop') {
      newContent.options = [''];
    }

    setContentBlocks(prev => [...prev, newContent]);
  };
  
  const handleRemoveContent = (index: number) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleContentChange = (index: number, field: keyof LessonContent, value: any) => {
    setContentBlocks(prev => prev.map((block, i) => 
      i === index ? { ...block, [field]: value } : block
    ));
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleContentChange(index, 'imageUrl', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 50MB for video)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video size should be less than 50MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Only video files are allowed",
        variant: "destructive",
      });
      return;
    }
    
    // Convert video to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleContentChange(index, 'videoUrl', base64);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = (index: number) => {
    handleContentChange(index, 'imageUrl', undefined);
    // Reset file input
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const removeVideo = (index: number) => {
    handleContentChange(index, 'videoUrl', undefined);
    // Reset file input
    if (videoInputRefs.current[index]) {
      videoInputRefs.current[index]!.value = '';
    }
  };

  const handleAddOption = (contentIndex: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex) return block;
      return {
        ...block,
        options: [...(block.options || []), '']
      };
    }));
  };

  const handleOptionChange = (contentIndex: number, optionIndex: number, value: string) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex) return block;
      const newOptions = [...(block.options || [])];
      newOptions[optionIndex] = value;
      return {
        ...block,
        options: newOptions
      };
    }));
  };

  const handleRemoveOption = (contentIndex: number, optionIndex: number) => {
    setContentBlocks(prev => prev.map((block, i) => {
      if (i !== contentIndex) return block;
      return {
        ...block,
        options: (block.options || []).filter((_, j) => j !== optionIndex)
      };
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your lesson.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLearningType) {
      toast({
        title: "Learning type required",
        description: "Please select a learning type for your lesson.",
        variant: "destructive",
      });
      return;
    }

    // Validate content blocks
    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];
      
      if (block.type === 'text' && !block.content?.trim()) {
        toast({
          title: "Incomplete content",
          description: `Text block ${i + 1} needs content.`,
          variant: "destructive",
        });
        return;
      }

      if ((block.type === 'image' || block.type === 'imageWithPrompt') && !block.imageUrl) {
        toast({
          title: "Missing image",
          description: `Image block ${i + 1} needs an image.`,
          variant: "destructive",
        });
        return;
      }

      if (block.type === 'video' && !block.videoUrl) {
        toast({
          title: "Missing video",
          description: `Video block ${i + 1} needs a video file.`,
          variant: "destructive",
        });
        return;
      }

      if (block.type === 'imageWithPrompt' && !block.prompt?.trim()) {
        toast({
          title: "Missing prompt",
          description: `Image prompt block ${i + 1} needs a prompt/question.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Create lesson object
    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title,
      description,
      gradeLevel: selectedGrade,
      subject,
      content: contentBlocks,
      learningType: selectedLearningType,
      createdBy: JSON.parse(localStorage.getItem('mathWithMalikTeacher') || '{}').id || 'unknown',
      createdAt: new Date().toISOString(),
      accessCode: generateAccessCode(),
    };
    
    onSave(lesson);
    
    toast({
      title: "Lesson saved!",
      description: "Your lesson has been created successfully.",
    });
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel} 
          className="mr-2"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Create New Lesson</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter lesson title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="grade">Grade Level</Label>
                  <Select 
                    value={selectedGrade.toString()} 
                    onValueChange={(val) => setSelectedGrade(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your lesson"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getLearningTypes().map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedLearningType === type.id
                        ? 'border-2 border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleLearningTypeChange(type.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-gray-100">
                        {type.icon}
                      </div>
                      <h3 className="font-semibold">{type.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Blocks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lesson Content</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddContent('text')}
                >
                  <Plus size={16} className="mr-1" /> Add Text
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddContent('image')}
                >
                  <Plus size={16} className="mr-1" /> Add Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddContent('video')}
                >
                  <Plus size={16} className="mr-1" /> Add Video
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddContent('activity')}
                >
                  <Plus size={16} className="mr-1" /> Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contentBlocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>Add content blocks to your lesson using the buttons above.</p>
                  </div>
                ) : (
                  contentBlocks.map((block, index) => (
                    <div key={block.id} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemoveContent(index)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                      
                      {block.type === 'text' && (
                        <div className="space-y-2">
                          <Label htmlFor={`text-content-${index}`}>Text Content</Label>
                          <Textarea
                            id={`text-content-${index}`}
                            value={block.content}
                            onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                            placeholder="Enter text content..."
                            rows={4}
                          />
                        </div>
                      )}
                      
                      {block.type === 'image' && (
                        <div className="space-y-4">
                          <Label>Image</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              onChange={(e) => handleImageUpload(index, e)}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRefs.current[index]?.click()}
                            >
                              <Upload size={16} className="mr-2" />
                              Upload Image
                            </Button>
                            {block.imageUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeImage(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                          {block.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={block.imageUrl}
                                alt="Content image"
                                className="max-h-40 object-contain rounded border border-gray-200"
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor={`image-caption-${index}`}>Caption (Optional)</Label>
                            <Input
                              id={`image-caption-${index}`}
                              value={block.content || ''}
                              onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                              placeholder="Image caption..."
                            />
                          </div>
                        </div>
                      )}
                      
                      {block.type === 'video' && (
                        <div className="space-y-4">
                          <Label>Video</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="video/*"
                              ref={(el) => (videoInputRefs.current[index] = el)}
                              onChange={(e) => handleVideoUpload(index, e)}
                              className="hidden"
                              id={`video-upload-${index}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => videoInputRefs.current[index]?.click()}
                            >
                              <Upload size={16} className="mr-2" />
                              Upload Video
                            </Button>
                            {block.videoUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeVideo(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                          {block.videoUrl && (
                            <div className="mt-2">
                              <video
                                src={block.videoUrl}
                                controls
                                className="max-h-40 rounded border border-gray-200"
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor={`video-caption-${index}`}>Caption (Optional)</Label>
                            <Input
                              id={`video-caption-${index}`}
                              value={block.content || ''}
                              onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                              placeholder="Video caption..."
                            />
                          </div>
                        </div>
                      )}
                      
                      {block.type === 'activity' && (
                        <div className="space-y-4">
                          <Label>Activity</Label>
                          <Textarea
                            value={block.content || ''}
                            onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                            placeholder="Activity instructions..."
                            rows={3}
                          />
                          
                          <ActivitySection 
                            activity={block.activity || {
                              activityType: "teacher-led",
                              teamMode: { enabled: false },
                              scoring: { enabled: false }
                            }}
                            onChange={(updatedActivity) => {
                              handleContentChange(index, 'activity', updatedActivity);
                            }}
                            index={index}
                          />
                        </div>
                      )}
                      
                      {block.type === 'imageWithPrompt' && (
                        <div className="space-y-4">
                          <Label>Image with Prompt</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              onChange={(e) => handleImageUpload(index, e)}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRefs.current[index]?.click()}
                            >
                              <Upload size={16} className="mr-2" />
                              Upload Image
                            </Button>
                            {block.imageUrl && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeImage(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                          {block.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={block.imageUrl}
                                alt="Prompt image"
                                className="max-h-40 object-contain rounded border border-gray-200"
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor={`prompt-${index}`}>Prompt/Question</Label>
                            <Textarea
                              id={`prompt-${index}`}
                              value={block.prompt || ''}
                              onChange={(e) => handleContentChange(index, 'prompt', e.target.value)}
                              placeholder="Enter your question or prompt..."
                              rows={2}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Possible Answers (Optional)</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddOption(index)}
                                className="h-8 px-2 text-xs"
                              >
                                <Plus size={14} className="mr-1" /> Add Option
                              </Button>
                            </div>
                            
                            {(block.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveOption(index, optionIndex)}
                                  className="h-8 w-8"
                                >
                                  <X size={14} className="text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {block.type === 'dragAndDrop' && (
                        <div className="space-y-4">
                          <Label>Drag and Drop Activity</Label>
                          <Textarea
                            value={block.content || ''}
                            onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                            placeholder="Instructions for drag and drop activity..."
                            rows={2}
                          />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Draggable Items</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddOption(index)}
                                className="h-8 px-2 text-xs"
                              >
                                <Plus size={14} className="mr-1" /> Add Item
                              </Button>
                            </div>
                            
                            {(block.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                  placeholder={`Item ${optionIndex + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveOption(index, optionIndex)}
                                  className="h-8 w-8"
                                >
                                  <X size={14} className="text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Submit Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Lesson
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LessonBuilder;
