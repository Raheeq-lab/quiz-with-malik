import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { X, Plus, Trash2, Image, Upload, FileText, BookOpen, Laptop, BookText, Brain, BarChart2, Gamepad2, BriefcaseBusiness, MessageSquare, Pen, Headphones, Pencil, Search, Play, MousePointer, CheckSquare, FileUp } from "lucide-react";
import { Lesson, LessonContent } from '@/types/quiz';
import SubjectSelector from '@/components/SubjectSelector';

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
  subject?: "math" | "english" | "ict";
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

const LessonBuilder: React.FC<LessonBuilderProps> = ({ grades, onSave, onCancel, subject = "math" }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<"math" | "english" | "ict">(subject);
  const [contentBlocks, setContentBlocks] = useState<LessonContent[]>([initialContent]);
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Define learning types based on selected subject
  const getLearningTypes = (): LearningTypeOption[] => {
    switch (selectedSubject) {
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
      default:
        return [initialContent];
    }
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
    setContentBlocks(prev => [...prev, {
      id: `content-${Date.now()}-${prev.length}`,
      type,
      content: '',
      options: type === 'imageWithPrompt' || type === 'dragAndDrop' ? [''] : undefined,
    }]);
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
  
  const removeImage = (index: number) => {
    handleContentChange(index, 'imageUrl', undefined);
    // Reset file input
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
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
    
    if (!selectedGrade) {
      toast({
        title: "Grade level required",
        description: "Please select a grade level for your lesson.",
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
      gradeLevel: parseInt(selectedGrade),
      subject: selectedSubject,
      learningType: selectedLearningType, // Add learning type to the lesson
      content: contentBlocks,
      accessCode: generateAccessCode(),
      createdBy: JSON.parse(localStorage.getItem('mathWithMalikTeacher') || '{}').id || 'unknown',
      createdAt: new Date().toISOString(),
    };
    
    onSave(lesson);
  };

  const getSubjectIcon = () => {
    switch (selectedSubject) {
      case "math": return <BookOpen className="text-purple-500" />;
      case "english": return <BookText className="text-green-500" />;
      case "ict": return <Laptop className="text-orange-500" />;
      default: return <BookOpen className="text-purple-500" />;
    }
  };

  // Get color based on subject
  const getSubjectColorClass = () => {
    switch (selectedSubject) {
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
            <Label>Text Content</Label>
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
            <Label>Image</Label>
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
      
      case 'imageWithPrompt':
        return (
          <div className="space-y-4">
            <Label>Image with Question/Prompt</Label>
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
              <Label>Question/Prompt</Label>
              <Textarea
                value={block.prompt || ''}
                onChange={(e) => handleContentChange(index, 'prompt', e.target.value)}
                placeholder="e.g., Describe what you see in this image."
                rows={2}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Answer Options (Optional)</Label>
                <Button
                  type="button"
                  onClick={() => handleAddOption(index)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Option
                </Button>
              </div>
              
              {(block.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                    {String.fromCharCode(65 + optionIndex)}
                  </div>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveOption(index, optionIndex)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      
      // For now, we'll handle drag-and-drop and labeling similarly to imageWithPrompt
      case 'dragAndDrop':
      case 'labeling':
        return (
          <div className="space-y-4">
            <Label>{block.type === 'dragAndDrop' ? 'Drag and Drop Exercise' : 'Labeling Exercise'}</Label>
            
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
              <Label>Instructions</Label>
              <Textarea
                value={block.content || ''}
                onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                placeholder={block.type === 'dragAndDrop' 
                  ? "e.g., Drag the labels to the correct parts of the image." 
                  : "e.g., Label the components of this computer."
                }
                rows={2}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{block.type === 'dragAndDrop' ? 'Items to Drag' : 'Labels'}</Label>
                <Button
                  type="button"
                  onClick={() => handleAddOption(index)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              </div>
              
              {(block.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    placeholder={block.type === 'dragAndDrop' ? `Item ${optionIndex + 1}` : `Label ${optionIndex + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveOption(index, optionIndex)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Get the list of learning types based on subject
  const learningTypes = getLearningTypes();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getSubjectIcon()}
          <span>Create New Lesson</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Vocabulary"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this lesson covers"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <SubjectSelector 
                  selectedSubject={selectedSubject}
                  onChange={(subject) => {
                    setSelectedSubject(subject as "math" | "english" | "ict");
                    setSelectedLearningType(''); // Reset learning type when subject changes
                  }}
                />
              </div>
            </div>

            {/* Learning Types Selection */}
            <div>
              <Label htmlFor="learningType">Learning Type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {learningTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedLearningType === type.id
                        ? selectedSubject === "math"
                          ? "bg-purple-100 border-purple-400"
                          : selectedSubject === "english"
                          ? "bg-green-100 border-green-400"
                          : "bg-orange-100 border-orange-400"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => handleLearningTypeChange(type.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {type.icon}
                      <span className="font-medium">{type.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Lesson Content</h3>
              
              <div className="flex items-center gap-2">
                <Tabs defaultValue="text">
                  <TabsList>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="interactive">Interactive</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="space-y-0 py-0 px-0 mt-0">
                    <Button
                      type="button"
                      onClick={() => handleAddContent('text')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Add Text Block
                    </Button>
                  </TabsContent>
                  <TabsContent value="image" className="space-y-0 py-0 px-0 mt-0">
                    <Button
                      type="button"
                      onClick={() => handleAddContent('image')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Image size={16} />
                      Add Image
                    </Button>
                  </TabsContent>
                  <TabsContent value="interactive" className="space-y-0 py-0 px-0 mt-0">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleAddContent('imageWithPrompt')}
                        variant="outline"
                        size="sm"
                      >
                        Image + Question
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleAddContent('dragAndDrop')}
                        variant="outline"
                        size="sm"
                      >
                        Drag & Drop
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {contentBlocks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">Add content blocks to your lesson.</p>
                <p className="text-gray-500">Start by clicking one of the buttons above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {contentBlocks.map((block, index) => (
                  <div 
                    key={block.id} 
                    className={`border rounded-lg p-4 space-y-4 ${getSubjectColorClass()}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-md font-medium flex items-center gap-2">
                        {block.type === 'text' && <FileText size={18} />}
                        {block.type === 'image' && <Image size={18} />}
                        {block.type === 'imageWithPrompt' && <FileText size={18} />}
                        {block.type === 'dragAndDrop' && <FileText size={18} />}
                        {block.type === 'labeling' && <FileText size={18} />}
                        <span>{block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block {index + 1}</span>
                      </h4>
                      <Button
                        type="button"
                        onClick={() => handleRemoveContent(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    {renderContentBlock(block, index)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Create Lesson</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LessonBuilder;
