
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, Plus, Trash2, Clock, BookOpen, Laptop, BookText, Brain, 
  Play, PenTool, FileText, Download, Save, Eye
} from "lucide-react";
import { 
  Lesson, 
  LessonStructure, 
  LessonPhase, 
  LessonPhaseContent,
  QuizQuestion,
  ActivitySettings
} from '@/types/quiz';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ActivitySection from './ActivitySection';

interface ScaffoldedLessonBuilderProps {
  grades: number[];
  subject: "math" | "english" | "ict";
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

const generateAccessCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const initialLessonStructure: LessonStructure = {
  engage: {
    title: "Engage",
    timeInMinutes: 5,
    content: [{ id: `engage-${Date.now()}`, type: "text", content: "" }]
  },
  model: {
    title: "Model",
    timeInMinutes: 8,
    content: [{ id: `model-${Date.now()}`, type: "text", content: "" }]
  },
  guidedPractice: {
    title: "Guided Practice",
    timeInMinutes: 12,
    content: [{ id: `guided-${Date.now()}`, type: "text", content: "" }]
  },
  independentPractice: {
    title: "Independent Practice",
    timeInMinutes: 10,
    content: [{ id: `independent-${Date.now()}`, type: "text", content: "" }]
  },
  reflect: {
    title: "Reflect",
    timeInMinutes: 5,
    content: [{ id: `reflect-${Date.now()}`, type: "text", content: "" }]
  }
};

const initialActivitySettings: ActivitySettings = {
  activityType: "teacher-led",
  teamMode: {
    enabled: false
  },
  scoring: {
    enabled: false
  }
};

// AI Tools suggestions based on subject
const getAiToolSuggestions = (subject: "math" | "english" | "ict") => {
  switch(subject) {
    case "math":
      return ["IXL AI Assistant", "Khan Academy AI", "Photomath", "Desmos", "GeoGebra"];
    case "english":
      return ["Quill", "CommonLit", "NoRedInk", "ReadWorks AI", "Grammarly"];
    case "ict":
      return ["Codecademy AI", "Replit", "CS First", "Scratch AI", "TinkerCAD"];
    default:
      return [];
  }
};

// Topic suggestions based on subject and grade
const getTopicSuggestions = (subject: "math" | "english" | "ict", grade: number) => {
  if (subject === "math") {
    if (grade <= 5) {
      return ["Addition & Subtraction", "Multiplication & Division", "Fractions", "Shapes & Geometry", "Measurement"];
    } else if (grade <= 8) {
      return ["Algebra Basics", "Ratios & Proportions", "Integers", "Geometry & Measurement", "Statistics & Probability"];
    } else {
      return ["Advanced Algebra", "Geometry & Trigonometry", "Functions", "Statistics", "Calculus Concepts"];
    }
  } else if (subject === "english") {
    if (grade <= 5) {
      return ["Phonics & Word Recognition", "Reading Comprehension", "Grammar Basics", "Writing Narratives", "Vocabulary Building"];
    } else if (grade <= 8) {
      return ["Literature Analysis", "Essay Writing", "Grammar & Mechanics", "Reading Non-Fiction", "Creative Writing"];
    } else {
      return ["Literary Analysis", "Research Writing", "Rhetoric & Persuasion", "Shakespeare", "Poetry & Prose"];
    }
  } else {
    if (grade <= 5) {
      return ["Computer Basics", "Internet Safety", "Basic Coding", "Digital Art", "Word Processing"];
    } else if (grade <= 8) {
      return ["Block Coding", "Web Design Basics", "Digital Citizenship", "Multimedia Creation", "Spreadsheets"];
    } else {
      return ["Programming Languages", "Web Development", "Data Analysis", "Cybersecurity", "Game Development"];
    }
  }
};

const ScaffoldedLessonBuilder: React.FC<ScaffoldedLessonBuilderProps> = ({ grades, subject, onSave, onCancel }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(grades[0] || 1);
  const [topic, setTopic] = useState<string>('');
  const [lessonStructure, setLessonStructure] = useState<LessonStructure>(initialLessonStructure);
  const [activePhase, setActivePhase] = useState<keyof LessonStructure>("engage");
  const [showPreview, setShowPreview] = useState(false);
  const [activitySettings, setActivitySettings] = useState<ActivitySettings>(initialActivitySettings);
  
  const aiTools = getAiToolSuggestions(subject);
  const topicSuggestions = getTopicSuggestions(subject, gradeLevel);
  
  const totalLessonTime = Object.values(lessonStructure).reduce(
    (total, phase) => total + phase.timeInMinutes, 0
  );

  const handleAddContent = (phase: keyof LessonStructure, type: LessonPhaseContent['type']) => {
    const newContent: LessonPhaseContent = {
      id: `${phase}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      content: ""
    };
    
    setLessonStructure(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        content: [...prev[phase].content, newContent]
      }
    }));
  };
  
  const handleRemoveContent = (phase: keyof LessonStructure, contentId: string) => {
    setLessonStructure(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        content: prev[phase].content.filter(item => item.id !== contentId)
      }
    }));
  };
  
  const handleContentChange = (
    phase: keyof LessonStructure, 
    contentId: string, 
    field: string, 
    value: any
  ) => {
    setLessonStructure(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        content: prev[phase].content.map(item => 
          item.id === contentId ? { ...item, [field]: value } : item
        )
      }
    }));
  };
  
  const handlePhaseTimeChange = (phase: keyof LessonStructure, timeInMinutes: number) => {
    setLessonStructure(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        timeInMinutes
      }
    }));
  };

  const handleActivityChange = (updatedActivity: ActivitySettings) => {
    setActivitySettings(updatedActivity);
  };

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your lesson.",
        variant: "destructive",
      });
      return;
    }

    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please select or enter a topic for your lesson.",
        variant: "destructive",
      });
      return;
    }

    // Create the lesson object
    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title,
      description: description || `${title} - ${topic} (Grade ${gradeLevel})`,
      gradeLevel,
      subject,
      content: [], // We'll use the lessonStructure instead
      lessonStructure,
      activity: activitySettings,
      createdBy: JSON.parse(localStorage.getItem('mathWithMalikTeacher') || '{}').id || 'unknown',
      createdAt: new Date().toISOString(),
      accessCode: generateAccessCode(),
      learningType: "scaffolded", // This is a scaffolded lesson
    };
    
    onSave(lesson);
    
    toast({
      title: "Lesson saved!",
      description: "Your scaffolded lesson has been created successfully.",
    });
  };

  const getPhaseColor = (phase: keyof LessonStructure) => {
    switch(phase) {
      case "engage": return "bg-blue-500 text-white";
      case "model": return "bg-purple-500 text-white";
      case "guidedPractice": return "bg-green-500 text-white";
      case "independentPractice": return "bg-orange-500 text-white";
      case "reflect": return "bg-pink-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPhaseProgressColor = (phase: keyof LessonStructure) => {
    switch(phase) {
      case "engage": return "bg-blue-500";
      case "model": return "bg-purple-500";
      case "guidedPractice": return "bg-green-500";
      case "independentPractice": return "bg-orange-500";
      case "reflect": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  const getSubjectIcon = () => {
    switch(subject) {
      case "math": return <BookOpen className="text-purple-500" />;
      case "english": return <BookText className="text-green-500" />;
      case "ict": return <Laptop className="text-orange-500" />;
      default: return <BookOpen />;
    }
  };

  const renderContentBlock = (
    phase: keyof LessonStructure,
    content: LessonPhaseContent,
    index: number
  ) => {
    switch(content.type) {
      case "text":
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Text Content</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(phase, content.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Textarea
              value={content.content}
              onChange={(e) => handleContentChange(phase, content.id, "content", e.target.value)}
              placeholder={`Enter content for the ${lessonStructure[phase].title} phase...`}
              rows={3}
            />
          </div>
        );
        
      case "image":
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Image</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(phase, content.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Input
              type="text"
              value={content.imageUrl || ''}
              onChange={(e) => handleContentChange(phase, content.id, "imageUrl", e.target.value)}
              placeholder="Enter image URL"
            />
            <Input
              value={content.content}
              onChange={(e) => handleContentChange(phase, content.id, "content", e.target.value)}
              placeholder="Image caption (optional)"
            />
            {content.imageUrl && (
              <div className="mt-2">
                <img 
                  src={content.imageUrl} 
                  alt={content.content || "Lesson image"} 
                  className="max-h-40 rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        );
        
      case "video":
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Video</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(phase, content.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Input
              type="text"
              value={content.videoUrl || ''}
              onChange={(e) => handleContentChange(phase, content.id, "videoUrl", e.target.value)}
              placeholder="Enter video URL (YouTube or direct MP4 link)"
            />
            <Input
              value={content.content}
              onChange={(e) => handleContentChange(phase, content.id, "content", e.target.value)}
              placeholder="Video title or description"
            />
          </div>
        );
        
      case "quiz":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Quick Quiz Question</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(phase, content.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Textarea
              value={content.content}
              onChange={(e) => handleContentChange(phase, content.id, "content", e.target.value)}
              placeholder="Enter quiz question"
              rows={2}
            />
            
            {/* Simple quiz options - could be expanded for more complex quizzes */}
            <div className="space-y-2">
              <Label>Options (first one will be correct)</Label>
              {["A", "B", "C", "D"].map((option, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    {option}
                  </div>
                  <Input 
                    placeholder={`Option ${option}`}
                    value={content.quizQuestions?.[0]?.options?.[idx] || ""}
                    onChange={(e) => {
                      const currentOptions = content.quizQuestions?.[0]?.options || ["", "", "", ""];
                      const newOptions = [...currentOptions];
                      newOptions[idx] = e.target.value;
                      
                      const quizQuestions: QuizQuestion[] = [{
                        id: content.id + "-quiz",
                        text: content.content,
                        options: newOptions,
                        correctOptionIndex: 0, // First option is correct by default
                      }];
                      
                      handleContentChange(phase, content.id, "quizQuestions", quizQuestions);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
        
      case "activity":
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Activity</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(phase, content.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Textarea
              value={content.content}
              onChange={(e) => handleContentChange(phase, content.id, "content", e.target.value)}
              placeholder="Describe the activity"
              rows={3}
            />
            <div className="pt-2">
              <Label>AI Tool Assistance (optional)</Label>
              <Select 
                value={content.aiToolUsed || "none"}
                onValueChange={(value) => handleContentChange(phase, content.id, "aiToolUsed", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI tool to help" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No AI tool</SelectItem>
                  {aiTools.map(tool => (
                    <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "resource":
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Resource</Label>
              <Button
                type="button"
                onClick={() => handleRemoveContent(phase, content.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <Input
              value={content.content}
              onChange={(e) => handleContentChange(phase, content.id, "content", e.target.value)}
              placeholder="Resource title or description"
            />
            <Input
              value={content.resourceUrl || ''}
              onChange={(e) => handleContentChange(phase, content.id, "resourceUrl", e.target.value)}
              placeholder="Resource URL or reference"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  // Student preview component
  const StudentPreview = () => {
    const [currentPhase, setCurrentPhase] = useState<keyof LessonStructure>("engage");
    const phases: (keyof LessonStructure)[] = ["engage", "model", "guidedPractice", "independentPractice", "reflect"];
    const currentPhaseIndex = phases.indexOf(currentPhase);
    
    const phaseNames: Record<keyof LessonStructure, string> = {
      engage: "Engage",
      model: "Learn",
      guidedPractice: "Practice Together",
      independentPractice: "Try It Yourself",
      reflect: "Think About It"
    };

    const phaseIcons: Record<keyof LessonStructure, React.ReactNode> = {
      engage: <Play size={18} />,
      model: <BookOpen size={18} />,
      guidedPractice: <PenTool size={18} />,
      independentPractice: <FileText size={18} />,
      reflect: <Brain size={18} />
    };

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Card className="border-2 border-blue-300 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-poppins">{title || "Awesome Lesson"}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/10">
                  <Clock size={14} className="mr-1" /> {totalLessonTime} min
                </Badge>
              </div>
            </div>
            <p className="opacity-90 text-sm mt-1">{topic || "Fascinating Topic"}</p>
          </CardHeader>
          
          <div className="p-4">
            <div className="flex mb-4 justify-between gap-2">
              {phases.map((phase, index) => (
                <div 
                  key={phase}
                  onClick={() => setCurrentPhase(phase)}
                  className={`cursor-pointer flex-1 rounded-lg border transition-all ${
                    currentPhase === phase 
                      ? 'border-2 border-blue-500 shadow-md transform scale-105' 
                      : 'border-gray-200'
                  } ${index < currentPhaseIndex ? 'bg-gray-100' : ''}`}
                >
                  <div className={`rounded-t-md p-2 flex justify-center items-center gap-1 ${
                    getPhaseColor(phase)
                  }`}>
                    {phaseIcons[phase]}
                    <span className="text-xs font-medium">{phaseNames[phase]}</span>
                  </div>
                  <div className="p-2 text-center text-xs">
                    {lessonStructure[phase].timeInMinutes} min
                    {index < currentPhaseIndex && (
                      <div className="mt-1 flex justify-center">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <Progress 
                value={(currentPhaseIndex + 1) / phases.length * 100} 
                className="h-2"
              />
              <div className="mt-1 text-right text-xs text-gray-500">
                Progress: {Math.round((currentPhaseIndex + 1) / phases.length * 100)}%
              </div>
            </div>
            
            <Card className="border shadow-sm">
              <CardHeader className={`py-3 ${getPhaseColor(currentPhase)}`}>
                <CardTitle className="text-lg flex items-center gap-2">
                  {phaseIcons[currentPhase]}
                  {phaseNames[currentPhase]}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                {lessonStructure[currentPhase].content.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Content for this section will appear here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessonStructure[currentPhase].content.map((content, idx) => (
                      <div key={idx} className="border-b pb-3 last:border-0">
                        {content.type === "text" && (
                          <p>{content.content || "Text content will appear here"}</p>
                        )}
                        {content.type === "image" && content.imageUrl && (
                          <div className="space-y-2">
                            <img 
                              src={content.imageUrl} 
                              alt={content.content || "Lesson image"}
                              className="max-h-40 rounded mx-auto" 
                            />
                            {content.content && <p className="text-sm text-center">{content.content}</p>}
                          </div>
                        )}
                        {content.type === "quiz" && (
                          <div className="space-y-3">
                            <p className="font-medium">{content.content || "Quiz question"}</p>
                            <div className="space-y-2">
                              {(content.quizQuestions?.[0]?.options || ["Option A", "Option B", "Option C", "Option D"]).map((option, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-blue-50 cursor-pointer">
                                  <div className="h-6 w-6 rounded-full flex items-center justify-center bg-white border border-gray-300 text-xs">
                                    {String.fromCharCode(65 + i)}
                                  </div>
                                  <span>{option || `Option ${String.fromCharCode(65 + i)}`}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {content.type === "activity" && (
                          <div className="space-y-2">
                            <p>{content.content || "Activity instructions"}</p>
                            {content.aiToolUsed && (
                              <div className="bg-blue-50 p-2 rounded flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Assisted by {content.aiToolUsed}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {content.type === "resource" && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium">{content.content || "Resource Title"}</div>
                              {content.resourceUrl && (
                                <div className="text-xs text-blue-500">{content.resourceUrl}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-3 border-t bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentPhaseIndex > 0) {
                      setCurrentPhase(phases[currentPhaseIndex - 1]);
                    }
                  }}
                  disabled={currentPhaseIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex items-center">
                  {currentPhaseIndex < phases.length - 1 ? (
                    <Badge variant="outline" className="bg-gray-100">
                      {lessonStructure[currentPhase].timeInMinutes} min
                    </Badge>
                  ) : (
                    <div className="flex gap-1">
                      <Badge className="bg-yellow-500">+10 XP</Badge>
                      <Badge className="bg-blue-500">Completed!</Badge>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => {
                    if (currentPhaseIndex < phases.length - 1) {
                      setCurrentPhase(phases[currentPhaseIndex + 1]);
                    }
                  }}
                  disabled={currentPhaseIndex === phases.length - 1}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Card>
      </div>
    );
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {getSubjectIcon()}
          <span>Scaffolded Lesson Builder</span>
        </h1>
      </div>
      
      {showPreview ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Student Preview</h2>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Editor
            </Button>
          </div>
          <StudentPreview />
        </div>
      ) : (
        <Card className="border-2 border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>Create a 40-Minute Scaffolded Lesson</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Lesson Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Fractions"
                />
              </div>
              
              <div>
                <Label htmlFor="topic">Topic</Label>
                <div className="relative">
                  <Input
                    id="topic"
                    list="topicSuggestions"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={`e.g., ${topicSuggestions[0] || "Enter topic"}`}
                  />
                  <datalist id="topicSuggestions">
                    {topicSuggestions.map((topic, i) => (
                      <option key={i} value={topic} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the lesson"
                  rows={2}
                />
              </div>
              
              <div className="flex flex-col justify-end">
                <div className="flex flex-wrap gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Total: {totalLessonTime} minutes</span>
                  </div>
                  
                  <div className="flex gap-2">
                    
                  </div>
                </div>
              </div>
            </div>
            
            {/* Remove the tabs section and just show lesson structure directly */}
            <div className="space-y-6">
              <Tabs 
                value={activePhase} 
                onValueChange={(value) => setActivePhase(value as keyof LessonStructure)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger 
                    value="engage"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Engage
                    <span className="ml-1 text-xs">({lessonStructure.engage.timeInMinutes}m)</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="model"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Model
                    <span className="ml-1 text-xs">({lessonStructure.model.timeInMinutes}m)</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="guidedPractice"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Guided
                    <span className="ml-1 text-xs">({lessonStructure.guidedPractice.timeInMinutes}m)</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="independentPractice"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Independent
                    <span className="ml-1 text-xs">({lessonStructure.independentPractice.timeInMinutes}m)</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reflect"
                    className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                  >
                    Reflect
                    <span className="ml-1 text-xs">({lessonStructure.reflect.timeInMinutes}m)</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="engage" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Engage Phase</h3>
                      <p className="text-sm text-gray-500">Hook students and activate prior knowledge</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="engageTime" className="mr-2 text-sm">Minutes:</Label>
                        <Input
                          id="engageTime"
                          type="number"
                          min="1"
                          max="15"
                          value={lessonStructure.engage.timeInMinutes}
                          onChange={(e) => handlePhaseTimeChange("engage", parseInt(e.target.value) || 5)}
                          className="w-16 h-8 px-2 py-1"
                        />
                      </div>
                      <Button 
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Preview</span>
                      </Button>
                    </div>
                  </div>
                  
                  {lessonStructure.engage.content.map((content, index) => (
                    <div key={content.id} className="bg-white rounded-md border p-4 shadow-sm">
                      {renderContentBlock("engage", content, index)}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddContent("engage", "text")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Text</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("engage", "image")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Image</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("engage", "video")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Video</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("engage", "activity")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Activity</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="model" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Model Phase</h3>
                      <p className="text-sm text-gray-500">Demonstrate and explain new concepts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="modelTime" className="mr-2 text-sm">Minutes:</Label>
                        <Input
                          id="modelTime"
                          type="number"
                          min="1"
                          max="15"
                          value={lessonStructure.model.timeInMinutes}
                          onChange={(e) => handlePhaseTimeChange("model", parseInt(e.target.value) || 8)}
                          className="w-16 h-8 px-2 py-1"
                        />
                      </div>
                      <Button 
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Preview</span>
                      </Button>
                    </div>
                  </div>
                  
                  {lessonStructure.model.content.map((content, index) => (
                    <div key={content.id} className="bg-white rounded-md border p-4 shadow-sm">
                      {renderContentBlock("model", content, index)}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddContent("model", "text")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Text</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("model", "image")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Image</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("model", "video")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Video</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("model", "resource")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Resource</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="guidedPractice" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Guided Practice Phase</h3>
                      <p className="text-sm text-gray-500">Practice with teacher support</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="guidedTime" className="mr-2 text-sm">Minutes:</Label>
                        <Input
                          id="guidedTime"
                          type="number"
                          min="1"
                          max="20"
                          value={lessonStructure.guidedPractice.timeInMinutes}
                          onChange={(e) => handlePhaseTimeChange("guidedPractice", parseInt(e.target.value) || 12)}
                          className="w-16 h-8 px-2 py-1"
                        />
                      </div>
                      <Button 
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Preview</span>
                      </Button>
                    </div>
                  </div>
                  
                  {lessonStructure.guidedPractice.content.map((content, index) => (
                    <div key={content.id} className="bg-white rounded-md border p-4 shadow-sm">
                      {renderContentBlock("guidedPractice", content, index)}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddContent("guidedPractice", "text")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Text</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("guidedPractice", "quiz")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Quiz</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("guidedPractice", "activity")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Activity</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="independentPractice" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Independent Practice Phase</h3>
                      <p className="text-sm text-gray-500">Students apply learning independently</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="indTime" className="mr-2 text-sm">Minutes:</Label>
                        <Input
                          id="indTime"
                          type="number"
                          min="1"
                          max="20"
                          value={lessonStructure.independentPractice.timeInMinutes}
                          onChange={(e) => handlePhaseTimeChange("independentPractice", parseInt(e.target.value) || 10)}
                          className="w-16 h-8 px-2 py-1"
                        />
                      </div>
                      <Button 
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Preview</span>
                      </Button>
                    </div>
                  </div>
                  
                  {lessonStructure.independentPractice.content.map((content, index) => (
                    <div key={content.id} className="bg-white rounded-md border p-4 shadow-sm">
                      {renderContentBlock("independentPractice", content, index)}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddContent("independentPractice", "text")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Text</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("independentPractice", "quiz")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Quiz</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("independentPractice", "activity")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Activity</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="reflect" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Reflect Phase</h3>
                      <p className="text-sm text-gray-500">Summarize and check for understanding</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="reflectTime" className="mr-2 text-sm">Minutes:</Label>
                        <Input
                          id="reflectTime"
                          type="number"
                          min="1"
                          max="10"
                          value={lessonStructure.reflect.timeInMinutes}
                          onChange={(e) => handlePhaseTimeChange("reflect", parseInt(e.target.value) || 5)}
                          className="w-16 h-8 px-2 py-1"
                        />
                      </div>
                      <Button 
                        onClick={() => setShowPreview(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Preview</span>
                      </Button>
                    </div>
                  </div>
                  
                  {lessonStructure.reflect.content.map((content, index) => (
                    <div key={content.id} className="bg-white rounded-md border p-4 shadow-sm">
                      {renderContentBlock("reflect", content, index)}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddContent("reflect", "text")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Text</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("reflect", "quiz")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Quiz</span>
                    </Button>
                    <Button
                      onClick={() => handleAddContent("reflect", "activity")}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Activity</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Lesson
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ScaffoldedLessonBuilder;
