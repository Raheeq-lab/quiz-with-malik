
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Loader2 } from "lucide-react";
import { BookOpen, BookText, Laptop } from 'lucide-react';

interface QuestionGeneratorTabProps {
  grades: number[];
  subject?: "math" | "english" | "ict";
}

const QuestionGeneratorTab: React.FC<QuestionGeneratorTabProps> = ({ grades, subject = "math" }) => {
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    if (!selectedGrade || selectedTopics.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select grade level and at least one topic.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      // Sample questions based on subject
      let questions = "";
      
      if (subject === "math") {
        questions = `1. If x + 3 = 7, what is the value of x?
A) 2
B) 3
C) 4
D) 10

2. What is the area of a rectangle with length 8 cm and width 5 cm?
A) 13 cm²
B) 26 cm²
C) 40 cm²
D) 80 cm²

3. Solve for y: 2y - 5 = 11
A) y = 3
B) y = 8
C) y = 16
D) y = -3

4. What is 25% of 80?
A) 20
B) 40
C) 60
D) 100`;
      } else if (subject === "english") {
        questions = `1. Which of the following is a proper noun?
A) book
B) London
C) happy
D) quickly

2. Choose the sentence with the correct punctuation:
A) Where did you go yesterday.
B) Where did you go yesterday!
C) Where did you go yesterday?
D) Where did you go, yesterday

3. Identify the verb in this sentence: "The students completed their assignments."
A) students
B) their
C) completed
D) assignments

4. Which word is a synonym for "happy"?
A) sad
B) angry
C) joyful
D) tired`;
      } else if (subject === "ict") {
        questions = `1. What does CPU stand for?
A) Central Processing Unit
B) Computer Processing Unit
C) Central Program Unit
D) Control Processing Unit

2. Which of these is an input device?
A) Printer
B) Monitor
C) Speaker
D) Keyboard

3. What is the main purpose of an operating system?
A) To create documents
B) To connect to the internet
C) To manage hardware and software resources
D) To play games

4. What does HTML stand for?
A) Hyper Text Markup Language
B) High Tech Modern Language
C) Hyper Transfer Markup Language
D) Hyper Text Making Links`;
      }
      
      setGeneratedQuestions(questions);
      setIsGenerating(false);
      
      toast({
        title: "Questions generated!",
        description: `Generated ${questions.split('\n\n').length} questions for grade ${selectedGrade}`,
      });
    }, 2000);
  };

  const handleCopyQuestions = () => {
    navigator.clipboard.writeText(generatedQuestions);
    toast({
      title: "Copied to clipboard!",
      description: "Questions have been copied to clipboard.",
    });
  };

  // Get topics based on subject
  const getTopics = () => {
    switch (subject) {
      case "math":
        return [
          { value: "algebra", label: "Algebra" },
          { value: "geometry", label: "Geometry" },
          { value: "arithmetic", label: "Arithmetic" },
          { value: "fractions", label: "Fractions" },
          { value: "decimals", label: "Decimals" },
        ];
      case "english":
        return [
          { value: "grammar", label: "Grammar" },
          { value: "vocabulary", label: "Vocabulary" },
          { value: "reading", label: "Reading Comprehension" },
          { value: "writing", label: "Writing" },
          { value: "literature", label: "Literature" },
        ];
      case "ict":
        return [
          { value: "hardware", label: "Computer Hardware" },
          { value: "software", label: "Software" },
          { value: "networks", label: "Networks" },
          { value: "programming", label: "Programming Basics" },
          { value: "internet", label: "Internet & Web" },
        ];
      default:
        return [
          { value: "algebra", label: "Algebra" },
          { value: "geometry", label: "Geometry" },
        ];
    }
  };

  const getSubjectIcon = () => {
    switch (subject) {
      case "math": return <BookOpen size={20} className="text-purple-500" />;
      case "english": return <BookText size={20} className="text-green-500" />;
      case "ict": return <Laptop size={20} className="text-orange-500" />;
      default: return <BookOpen size={20} className="text-purple-500" />;
    }
  };

  // Get color based on subject
  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "bg-purple-600 hover:bg-purple-700";
      case "english": return "bg-green-600 hover:bg-green-700";
      case "ict": return "bg-orange-600 hover:bg-orange-700";
      default: return "bg-purple-600 hover:bg-purple-700";
    }
  };

  const getSubjectExample = () => {
    switch (subject) {
      case "math": return "e.g., 'If x + 3 = 7, what is x?'";
      case "english": return "e.g., 'Identify the noun in this sentence.'";
      case "ict": return "e.g., 'What does CPU stand for?'";
      default: return "e.g., 'What is 2 + 2?'";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {getSubjectIcon()}
        <h2 className="text-xl font-semibold">{subject.charAt(0).toUpperCase() + subject.slice(1)} Question Generator</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate {subject.charAt(0).toUpperCase() + subject.slice(1)} Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Grade Level</label>
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
              <label className="text-sm font-medium mb-1 block">Topics</label>
              <Select
                value={selectedTopics.length > 0 ? selectedTopics[0] : undefined}
                onValueChange={(value) => setSelectedTopics([value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {getTopics().map(topic => (
                    <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Button 
              onClick={handleGenerateClick} 
              disabled={isGenerating}
              className={`w-full ${getSubjectColor()}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Questions</>
              )}
            </Button>
          </div>
          
          {generatedQuestions && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Generated Questions</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyQuestions}
                  className="flex items-center gap-1"
                >
                  <Copy size={14} />
                  Copy
                </Button>
              </div>
              <Textarea
                value={generatedQuestions}
                readOnly
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                These questions are machine-generated. Please review for accuracy before use.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <div className="text-sm text-muted-foreground">
            Powered by AI to generate {subject}-specific questions
          </div>
          <Button variant="outline" onClick={() => window.open("#", "_blank")}>
            Learn More
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Example {subject.charAt(0).toUpperCase() + subject.slice(1)} Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Here are some example questions for {subject.charAt(0).toUpperCase() + subject.slice(1)} that you can use as inspiration:
          </p>
          
          <div className="space-y-4 p-4 bg-gray-50 rounded-md">
            {subject === "math" && (
              <>
                <div>
                  <p className="font-medium">Multiple Choice:</p>
                  <p>If x + 5 = 12, what is the value of x?</p>
                  <p>A) 5&nbsp;&nbsp;&nbsp;B) 7&nbsp;&nbsp;&nbsp;C) 12&nbsp;&nbsp;&nbsp;D) 17</p>
                </div>
                <div>
                  <p className="font-medium">True/False:</p>
                  <p>The sum of the angles in a triangle is 180 degrees.</p>
                </div>
              </>
            )}
            
            {subject === "english" && (
              <>
                <div>
                  <p className="font-medium">Fill in the blank:</p>
                  <p>The cat sat ___ the mat.</p>
                  <p>A) on&nbsp;&nbsp;&nbsp;B) in&nbsp;&nbsp;&nbsp;C) at&nbsp;&nbsp;&nbsp;D) by</p>
                </div>
                <div>
                  <p className="font-medium">Vocabulary:</p>
                  <p>What does the word "ecstatic" mean?</p>
                  <p>A) extremely happy&nbsp;&nbsp;&nbsp;B) very angry&nbsp;&nbsp;&nbsp;C) deeply sad&nbsp;&nbsp;&nbsp;D) completely bored</p>
                </div>
              </>
            )}
            
            {subject === "ict" && (
              <>
                <div>
                  <p className="font-medium">Hardware:</p>
                  <p>Which device is used for taking input from the user?</p>
                  <p>A) Monitor&nbsp;&nbsp;&nbsp;B) Keyboard&nbsp;&nbsp;&nbsp;C) Printer&nbsp;&nbsp;&nbsp;D) Speaker</p>
                </div>
                <div>
                  <p className="font-medium">Software:</p>
                  <p>Which of these is NOT an operating system?</p>
                  <p>A) Windows 11&nbsp;&nbsp;&nbsp;B) macOS&nbsp;&nbsp;&nbsp;C) Excel&nbsp;&nbsp;&nbsp;D) Linux</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionGeneratorTab;
