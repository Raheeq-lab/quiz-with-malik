
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, BarChart2, Gamepad2, BriefcaseBusiness, MessageSquare, FileText, Pen, Image, Headphones, Pencil, Search, Play, MousePointer, CheckSquare, FileUp } from "lucide-react";

interface LearningType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface LearningTypeCardsProps {
  subject: "math" | "english" | "ict";
}

const LearningTypeCards: React.FC<LearningTypeCardsProps> = ({ subject }) => {
  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "bg-purple-50 border-purple-200 hover:border-purple-300";
      case "english": return "bg-green-50 border-green-200 hover:border-green-300";
      case "ict": return "bg-orange-50 border-orange-200 hover:border-orange-300";
      default: return "bg-purple-50 border-purple-200 hover:border-purple-300";
    }
  };
  
  const getIconColor = () => {
    switch (subject) {
      case "math": return "text-purple-600";
      case "english": return "text-green-600";
      case "ict": return "text-orange-600";
      default: return "text-purple-600";
    }
  };

  const learningTypes: Record<string, LearningType[]> = {
    math: [
      {
        id: "problem-solving",
        title: "Problem Solving Practice",
        description: "Solve step-by-step math problems to build logic and accuracy.",
        icon: <Brain className={getIconColor()} />
      },
      {
        id: "visual-interactive",
        title: "Visual & Interactive Learning",
        description: "Learn through graphs, number lines, and drag-and-drop tools.",
        icon: <BarChart2 className={getIconColor()} />
      },
      {
        id: "game-based",
        title: "Game-Based Quizzes",
        description: "Practice with fun, timed challenges and scoring levels.",
        icon: <Gamepad2 className={getIconColor()} />
      },
      {
        id: "real-world",
        title: "Real-World Application",
        description: "Apply math in budgeting, measuring, and real-life scenarios.",
        icon: <BriefcaseBusiness className={getIconColor()} />
      },
      {
        id: "math-talks",
        title: "Math Talks",
        description: "Explain your solution strategy or compare methods with others.",
        icon: <MessageSquare className={getIconColor()} />
      }
    ],
    english: [
      {
        id: "reading-comprehension",
        title: "Reading Comprehension",
        description: "Read passages and answer questions to build understanding.",
        icon: <FileText className={getIconColor()} />
      },
      {
        id: "grammar-practice",
        title: "Grammar Practice",
        description: "Work on punctuation, sentence structure, and parts of speech.",
        icon: <Pen className={getIconColor()} />
      },
      {
        id: "picture-based",
        title: "Picture-Based Writing",
        description: "Describe or create stories from a visual prompt.",
        icon: <Image className={getIconColor()} />
      },
      {
        id: "speaking-listening",
        title: "Speaking & Listening",
        description: "Record spoken answers or respond after watching a clip.",
        icon: <Headphones className={getIconColor()} />
      },
      {
        id: "creative-expression",
        title: "Creative Expression",
        description: "Write stories, letters, and journal entries using prompts.",
        icon: <Pencil className={getIconColor()} />
      }
    ],
    ict: [
      {
        id: "identify-label",
        title: "Identify & Label",
        description: "Name parts of computers, software, or interfaces using images.",
        icon: <Search className={getIconColor()} />
      },
      {
        id: "watch-demonstrate",
        title: "Watch & Demonstrate",
        description: "Watch a task-based video and complete the digital activity.",
        icon: <Play className={getIconColor()} />
      },
      {
        id: "digital-tool",
        title: "Digital Tool Use",
        description: "Practice using basic apps (e.g., Word, Paint, Scratch).",
        icon: <MousePointer className={getIconColor()} />
      },
      {
        id: "concept-check",
        title: "Concept Check Quizzes",
        description: "Answer questions about ICT theory and digital safety.",
        icon: <CheckSquare className={getIconColor()} />
      },
      {
        id: "create-submit",
        title: "Create & Submit",
        description: "Upload original work like a document, design, or code snippet.",
        icon: <FileUp className={getIconColor()} />
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        {subject.charAt(0).toUpperCase() + subject.slice(1)} Learning Types
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {learningTypes[subject].map((type) => (
          <Card key={type.id} className={`border transition-all cursor-pointer ${getSubjectColor()}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {type.icon}
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningTypeCards;
