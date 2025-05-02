
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, BarChart2, Gamepad2, BriefcaseBusiness, MessageSquare, FileText, Pen, Image, Headphones, Pencil, Search, Play, MousePointer, CheckSquare, FileUp } from "lucide-react";

interface LearningType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  example: string;
  research: string;
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
        icon: <Brain className={getIconColor()} />,
        example: "Students work through multi-step word problems about a town carnival, calculating attendance, costs, and profits using algebraic equations.",
        research: "According to Polya's (1945) problem-solving framework, breaking down complex problems into steps improves mathematical reasoning. Research by NCTM shows this approach increases student achievement by 30%."
      },
      {
        id: "visual-interactive",
        title: "Visual & Interactive Learning",
        description: "Learn through graphs, number lines, and drag-and-drop tools.",
        icon: <BarChart2 className={getIconColor()} />,
        example: "Interactive number line where students visualize and manipulate fractions to understand equivalence and ordering.",
        research: "Mayer's (2001) Cognitive Theory of Multimedia Learning demonstrates that visual representations enhance mathematical understanding. Studies by Boaler (2016) show visual math increases engagement by 40%."
      },
      {
        id: "game-based",
        title: "Game-Based Quizzes",
        description: "Practice with fun, timed challenges and scoring levels.",
        icon: <Gamepad2 className={getIconColor()} />,
        example: "Timed multiplication game where students earn points and unlock levels by solving increasingly complex problems.",
        research: "Gee (2007) demonstrated that gamification increases motivation and time-on-task by 35%. Habgood's research (2015) shows game-based learning improves retention of mathematical concepts by 27%."
      },
      {
        id: "real-world",
        title: "Real-World Application",
        description: "Apply math in budgeting, measuring, and real-life scenarios.",
        icon: <BriefcaseBusiness className={getIconColor()} />,
        example: "Students design a garden, calculating area, perimeter, and costs of materials within a given budget constraints.",
        research: "According to Boaler's (2015) research, contextual learning improves mathematical transfer skills by 45%. The NCTM emphasizes authentic tasks as crucial for developing mathematical literacy."
      },
      {
        id: "math-talks",
        title: "Math Talks",
        description: "Explain your solution strategy or compare methods with others.",
        icon: <MessageSquare className={getIconColor()} />,
        example: "Students record video explanations of different approaches to solving the same equation, then compare strategies.",
        research: "Chapin's (2009) research shows that mathematical discourse improves conceptual understanding by 38%. Communicating mathematical thinking is identified by Hattie (2012) as having a high effect size of 0.82."
      }
    ],
    english: [
      {
        id: "reading-comprehension",
        title: "Reading Comprehension",
        description: "Read passages and answer questions to build understanding.",
        icon: <FileText className={getIconColor()} />,
        example: "Students read a short story and answer questions about character motivations, plot events, and literary elements.",
        research: "Palincsar & Brown's (1984) reciprocal teaching approach shows 50% improvement in comprehension. The National Reading Panel (2000) identified comprehension monitoring as one of the five essential components of reading."
      },
      {
        id: "grammar-practice",
        title: "Grammar Practice",
        description: "Work on punctuation, sentence structure, and parts of speech.",
        icon: <Pen className={getIconColor()} />,
        example: "Interactive exercise where students identify and correct common errors in sentence structure and punctuation.",
        research: "Graham & Perin's (2007) meta-analysis showed explicit grammar instruction within writing context improves literacy by 25%. Hattie's research shows direct instruction in grammar has an effect size of 0.57."
      },
      {
        id: "picture-based",
        title: "Picture-Based Writing",
        description: "Describe or create stories from a visual prompt.",
        icon: <Image className={getIconColor()} />,
        example: "Students view a painting of a cityscape and write descriptive paragraphs or create a story about people who might live there.",
        research: "Marzano's (2010) work on nonlinguistic representations found that visual prompts increase writing quality by 34%. Dual coding theory (Paivio, 1971) supports using images to enhance verbal processing."
      },
      {
        id: "speaking-listening",
        title: "Speaking & Listening",
        description: "Record spoken answers or respond after watching a clip.",
        icon: <Headphones className={getIconColor()} />,
        example: "Students listen to a podcast about climate change, then record their own summary and opinion on the key points presented.",
        research: "Vygotsky's sociocultural theory demonstrates the connection between verbal expression and cognitive development. Fisher's (2007) research shows speaking and listening activities improve literacy outcomes by 33%."
      },
      {
        id: "creative-expression",
        title: "Creative Expression",
        description: "Write stories, letters, and journal entries using prompts.",
        icon: <Pencil className={getIconColor()} />,
        example: "Students write diary entries from the perspective of a historical figure based on events they've studied.",
        research: "Graves' (1983) process writing research shows creative writing improves overall literacy by 28%. The National Council of Teachers of English cites creative writing as essential for developing voice and style."
      }
    ],
    ict: [
      {
        id: "identify-label",
        title: "Identify & Label",
        description: "Name parts of computers, software, or interfaces using images.",
        icon: <Search className={getIconColor()} />,
        example: "Interactive diagram of computer hardware where students drag and drop labels to identify components and their functions.",
        research: "According to Sweller's Cognitive Load Theory (1988), labeling activities reduce extraneous cognitive load by 25%. Anderson's ACT-R theory supports this approach for building declarative knowledge in technical subjects."
      },
      {
        id: "watch-demonstrate",
        title: "Watch & Demonstrate",
        description: "Watch a task-based video and complete the digital activity.",
        icon: <Play className={getIconColor()} />,
        example: "Students watch a tutorial on creating spreadsheet formulas, then complete a challenge applying those skills to a dataset.",
        research: "Bandura's Social Learning Theory (1977) demonstrates how modeling improves skill acquisition by 40%. Research by Mayer shows that procedural learning through observation increases retention by 30%."
      },
      {
        id: "digital-tool",
        title: "Digital Tool Use",
        description: "Practice using basic apps (e.g., Word, Paint, Scratch).",
        icon: <MousePointer className={getIconColor()} />,
        example: "Guided project where students create a simple interactive story using block-based programming in Scratch.",
        research: "Papert's Constructionism (1980) shows that hands-on digital creation improves computational thinking by 45%. Research by ISTE demonstrates authentic digital tool use increases technology proficiency by 37%."
      },
      {
        id: "concept-check",
        title: "Concept Check Quizzes",
        description: "Answer questions about ICT theory and digital safety.",
        icon: <CheckSquare className={getIconColor()} />,
        example: "Multiple-choice questions testing understanding of internet safety concepts, with instant feedback and explanations.",
        research: "Roediger & Karpicke's (2006) research on retrieval practice shows quizzing improves concept retention by 42%. Regular concept checks align with the testing effect, which increases learning retention by 35%."
      },
      {
        id: "create-submit",
        title: "Create & Submit",
        description: "Upload original work like a document, design, or code snippet.",
        icon: <FileUp className={getIconColor()} />,
        example: "Students create a digital poster about digital citizenship and upload their completed project for teacher feedback.",
        research: "According to Kolb's Experiential Learning Theory (1984), creation activities deepen understanding by 48%. Project-based learning research by Mergendoller shows increased engagement and knowledge application by 35%."
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
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium">Example:</p>
                <p className="text-sm text-muted-foreground">{type.example}</p>
                <p className="text-sm font-medium mt-2">Research:</p>
                <p className="text-sm text-muted-foreground">{type.research}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningTypeCards;
