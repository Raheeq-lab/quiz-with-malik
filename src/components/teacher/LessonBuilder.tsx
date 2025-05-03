
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
  Video, ArrowLeft, Activity
} from "lucide-react";
import { Lesson, LessonContent, ActivitySettings, TeamInfo } from '@/types/quiz';
import SubjectSelector from '@/components/SubjectSelector';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

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

const LessonBuilder: React.FC<LessonBuilderProps> = ({ grades, onSave, onCancel, subject = "math" }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentBlocks, setContentBlocks] = useState<LessonContent[]>([initialContent]);
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Define learning types based on selected subject
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

  // Get suggested content blocks based on learning type
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
  
  // Add the handler functions for activity settings
  const handleActivityTypeChange = (index: number, activityType: "teacher-led" | "print-practice" | "student-devices") => {
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
          activityType
        }
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

  // Handle learning type selection
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
      gradeLevel: grades[0] || 1, // Use the first grade from the dashboard
      subject,
      learningType: selectedLearningType,
      content: contentBlocks,
      accessCode: generateAccessCode(),
      createdBy: JSON.parse(localStorage.getItem('mathWithMalikTeacher') || '{}').id || 'unknown',
      createdAt: new Date().toISOString(),
    };
    
    onSave(lesson);
  };

  const getSubjectIcon = () => {
    switch (subject) {
      case "math": return <BookOpen className="text-purple-500" />;
      case "english": return <BookText className="text-green-500" />;
      case "ict": return <Laptop className="text-orange-500" />;
      default: return <BookOpen className="text-purple-500" />;
    }
  };

  // Get color based on subject
  const getSubjectColorClass = () => {
    switch (subject) {
      case "math": return "border-purple-300 bg-purple-50 text-purple-900";
      case "english": return "border-green-300 bg-green-50 text-green-900";
      case "ict": return "border-orange-300 bg-orange-50 text-orange-900";
      default: return "border-purple-300 bg-purple-50 text-purple-900";
    }
  };

  const renderContentBlock = (block: LessonContent, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Text Content</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(index)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => handleContentChange(index, 'content', e.target.value)}
              placeholder="Enter text content here..."
              rows={4}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Image</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(index)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            {block.imageUrl ? (
              <div className="relative mb-2">
                <img 
                  src={block.imageUrl} 
                  alt={`Image for block ${index + 1}`}
                  className="max-h-60 rounded-md border border-gray-200"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-8 w-8 p-1 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  ref={(el) => {
                    if (fileInputRefs.current.length <= index) {
                      fileInputRefs.current = [...fileInputRefs.current, el];
                    } else {
                      fileInputRefs.current[index] = el;
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => fileInputRefs.current[index]?.click()}
                >
                  <Upload size={16} />
                  Upload Image
                </Button>
                <span className="text-sm text-gray-500">Max size: 5MB</span>
              </div>
            )}
            <div>
              <Label>Caption (Optional)</Label>
              <Input
                value={block.content || ''}
                onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                placeholder="Image caption or description"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Video</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(index)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            {block.videoUrl ? (
              <div className="relative mb-2">
                <video 
                  src={block.videoUrl}
                  controls
                  className="w-full max-h-80 rounded-md border border-gray-200"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-8 w-8 p-1 rounded-full"
                  onClick={() => removeVideo(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  className="hidden"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => handleVideoUpload(index, e)}
                  ref={(el) => {
                    if (videoInputRefs.current.length <= index) {
                      videoInputRefs.current = [...videoInputRefs.current, el];
                    } else {
                      videoInputRefs.current[index] = el;
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => videoInputRefs.current[index]?.click()}
                >
                  <Upload size={16} />
                  Upload Video (MP4)
                </Button>
                <span className="text-sm text-gray-500">Max size: 50MB</span>
              </div>
            )}
            <div>
              <Label>Title (Optional)</Label>
              <Input
                value={block.content || ''}
                onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                placeholder="Video title or description"
              />
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label>Activity Content</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(index)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="space-y-3">
              <Label>Activity Title</Label>
              <Input
                value={block.content || ''}
                onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                placeholder="Enter title for this activity"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Activity Type (Required)</Label>
              <RadioGroup 
                value={block.activity?.activityType || 'teacher-led'} 
                onValueChange={(value) => handleActivityTypeChange(index, value as any)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${
                  block.activity?.activityType === "teacher-led" ? "border-blue-500 bg-blue-50" : ""
                }`}>
                  <RadioGroupItem value="teacher-led" id={`teacher-led-${index}`} />
                  <Label htmlFor={`teacher-led-${index}`} className="flex items-center cursor-pointer">
                    <span className="text-2xl mr-2">👨‍🏫</span> 
                    <div>
                      <div>Teacher-Led</div>
                      <div className="text-xs text-gray-500">Activity shown on teacher's screen</div>
                    </div>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${
                  block.activity?.activityType === "print-practice" ? "border-blue-500 bg-blue-50" : ""
                }`}>
                  <RadioGroupItem value="print-practice" id={`print-practice-${index}`} />
                  <Label htmlFor={`print-practice-${index}`} className="flex items-center cursor-pointer">
                    <span className="text-2xl mr-2">📝</span>
                    <div>
                      <div>Print & Practice</div>
                      <div className="text-xs text-gray-500">Activity done on paper or worksheets</div>
                    </div>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${
                  block.activity?.activityType === "student-devices" ? "border-blue-500 bg-blue-50" : ""
                }`}>
                  <RadioGroupItem value="student-devices" id={`student-devices-${index}`} />
                  <Label htmlFor={`student-devices-${index}`} className="flex items-center cursor-pointer">
                    <span className="text-2xl mr-2">💻</span>
                    <div>
                      <div>Student Devices</div>
                      <div className="text-xs text-gray-500">Activity completed on student laptops/tablets</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`team-mode-${index}`} className="flex items-center gap-2">
                  <span className="text-xl">👥</span> Enable Team Mode
                </Label>
                <Switch 
                  id={`team-mode-${index}`}
                  checked={block.activity?.teamMode?.enabled || false}
                  onCheckedChange={(checked) => handleTeamModeToggle(index, checked)}
                />
              </div>
              
              {block.activity?.teamMode?.enabled && (
                <div className="space-y-4 pl-4 pt-2 border-l-2 border-blue-200">
                  <div className="space-y-2">
                    <Label>Number of Teams</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number"
                        min={2}
                        max={6}
                        value={block.activity.teamMode.numberOfTeams || 3}
                        onChange={(e) => handleNumberOfTeamsChange(index, parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">(2-6 teams)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Team Setup</Label>
                    {block.activity.teamMode.teams?.map((team, teamIndex) => (
                      <div key={team.id} className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${team.color}`}>
                          {team.emoji}
                        </div>
                        <Input
                          value={team.name}
                          onChange={(e) => handleTeamNameChange(index, teamIndex, e.target.value)}
                          className="flex-1 min-w-[120px]"
                          placeholder="Team name"
                        />
                        <select
                          value={team.emoji}
                          onChange={(e) => handleTeamEmojiChange(index, teamIndex, e.target.value)}
                          className="p-1 border rounded-md"
                        >
                          {EMOJI_OPTIONS.map(emoji => (
                            <option key={emoji} value={emoji}>{emoji}</option>
                          ))}
                        </select>
                        <select
                          value={team.color}
                          onChange={(e) => handleTeamColorChange(index, teamIndex, e.target.value)}
                          className="p-1 border rounded-md"
                        >
                          {COLOR_OPTIONS.map(color => (
                            <option key={color} value={color}>
                              {color.replace('bg-', '').replace('-500', '')}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between border-t pt-4">
                <Label htmlFor={`scoring-${index}`} className="flex items-center gap-2">
                  <span className="text-xl">🏆</span> Enable Scoring
                </Label>
                <Switch 
                  id={`scoring-${index}`}
                  checked={block.activity?.scoring?.enabled || false}
                  onCheckedChange={(checked) => handleScoringToggle(index, checked)}
                />
              </div>
              
              {block.activity?.scoring?.enabled && (
                <div className="space-y-2 pl-4 pt-2 border-l-2 border-blue-200">
                  <Label>Scoring Type</Label>
                  <RadioGroup 
                    value={block.activity.scoring.type || "points"}
                    onValueChange={(value) => handleScoringTypeChange(index, value as "points" | "badges")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="points" id={`points-${index}`} />
                      <Label htmlFor={`points-${index}`}>Points</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="badges" id={`badges-${index}`} />
                      <Label htmlFor={`badges-${index}`}>Badges</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {subject === "math" && <BookOpen className="text-purple-500" />}
          {subject === "english" && <BookText className="text-green-500" />}
          {subject === "ict" && <Laptop className="text-orange-500" />}
          Create New Lesson
        </h2>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a clear, descriptive title..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what students will learn..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getLearningTypes().map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleLearningTypeChange(type.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedLearningType === type.id
                        ? getSubjectColorClass()
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <h3 className="font-medium">{type.title}</h3>
                    </div>
                    <p className="text-sm mt-1 text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contentBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="border rounded-lg p-4 relative"
                >
                  {renderContentBlock(block, index)}
                </div>
              ))}

              <div className="mt-4">
                <Label>Add Content Block</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-1 h-auto py-2"
                    onClick={() => handleAddContent('text')}
                  >
                    <FileText size={16} />
                    <span>Text</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-1 h-auto py-2"
                    onClick={() => handleAddContent('image')}
                  >
                    <Image size={16} />
                    <span>Image</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-1 h-auto py-2"
                    onClick={() => handleAddContent('video')}
                  >
                    <Video size={16} />
                    <span>Video</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-1 h-auto py-2"
                    onClick={() => handleAddContent('activity')}
                  >
                    <Activity size={16} />
                    <span>Activity</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className={
              subject === "math" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : subject === "english" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-orange-600 hover:bg-orange-700 text-white"
            }
          >
            Create Lesson
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LessonBuilder;
