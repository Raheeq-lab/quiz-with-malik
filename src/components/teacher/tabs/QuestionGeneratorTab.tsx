
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface QuestionGeneratorTabProps {
  grades: number[];
}

const QuestionGeneratorTab: React.FC<QuestionGeneratorTabProps> = ({ grades }) => {
  const { toast } = useToast();
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState("");
  
  const handleGenerateQuestions = async () => {
    if (!topic.trim() || !selectedGrade) {
      toast({
        title: "Information required",
        description: "Please enter both a topic and select a grade level.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQuestions(true);

    // Simulate AI question generation (in a real app, this would be an API call to an AI service)
    setTimeout(() => {
      // Mock AI-generated questions based on topic and grade
      const grade = parseInt(selectedGrade);
      const difficultyLevel = grade <= 6 ? "basic" : "intermediate";
      
      const generateMockQuestions = () => {
        // Generate math questions based on the grade level
        const questions = [];
        
        if (grade <= 4) {
          // Basic arithmetic for lower grades
          questions.push({
            text: `What is 25 + 37?`,
            options: ["52", "62", "72", "42"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `If you have 5 apples and eat 2, how many do you have left?`,
            options: ["2", "3", "5", "7"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `What is 9 × 4?`,
            options: ["13", "36", "45", "27"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `What is half of 18?`,
            options: ["9", "8", "6", "10"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `Which number is greater: 43 or 34?`,
            options: ["43", "34", "They are equal", "Cannot determine"],
            correctOptionIndex: 0
          });
        } else if (grade <= 7) {
          // Intermediate math for middle grades
          questions.push({
            text: `What is the value of x in the equation: 3x + 5 = 20?`,
            options: ["5", "15", "7.5", "5.5"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `What is the area of a rectangle with length 8 cm and width 6 cm?`,
            options: ["14 cm²", "28 cm²", "48 cm²", "54 cm²"],
            correctOptionIndex: 2
          });
          questions.push({
            text: `What is 1/4 + 3/8?`,
            options: ["4/12", "5/8", "6/12", "7/8"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `If 30% of a number is 15, what is the number?`,
            options: ["45", "50", "30", "60"],
            correctOptionIndex: 1
          });
          questions.push({
            text: `The average of 5 numbers is 12. If 4 of the numbers are 10, 15, 8, and 12, what is the 5th number?`,
            options: ["13", "14", "15", "16"],
            correctOptionIndex: 2
          });
        } else {
          // Advanced math for higher grades
          questions.push({
            text: `Simplify: 3(2x - 4) - 2(x + 5)`,
            options: ["4x - 22", "4x - 10", "6x - 22", "8x - 22"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `What is the solution to the quadratic equation x² - 5x + 6 = 0?`,
            options: ["x = 2, x = 3", "x = -2, x = -3", "x = 2, x = -3", "x = -2, x = 3"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `If a triangle has sides of length 6, 8, and 10, what type of triangle is it?`,
            options: ["Equilateral", "Isosceles", "Scalene", "Right"],
            correctOptionIndex: 3
          });
          questions.push({
            text: `What is the circumference of a circle with radius 7 cm? (Use π = 3.14)`,
            options: ["43.96 cm", "21.98 cm", "153.86 cm", "43.96 cm²"],
            correctOptionIndex: 0
          });
          questions.push({
            text: `If f(x) = 2x² - 3x + 4, what is f(2)?`,
            options: ["6", "7", "8", "9"],
            correctOptionIndex: 2
          });
        }
        
        // Add question IDs
        return questions.map((q, i) => ({
          id: `gen-${Date.now()}-${i}`,
          ...q
        }));
      };
      
      const questions = generateMockQuestions();
      setGeneratedQuestions(JSON.stringify(questions, null, 2));
      setIsGeneratingQuestions(false);
      
      toast({
        title: "Questions generated!",
        description: `Generated ${questions.length} questions for ${topic} (Grade ${grade})`,
      });
    }, 2000);
  };

  const handleCopyQuestions = () => {
    navigator.clipboard.writeText(generatedQuestions);
    toast({
      title: "Questions copied!",
      description: "The generated questions have been copied to clipboard.",
    });
  };

  return (
    <Card className="border-none">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">AI Math Question Generator</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic" className="mb-2 block">Math Topic</Label>
              <Input
                id="topic"
                placeholder="E.g., Fractions, Algebra, Geometry"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aiGradeLevel" className="mb-2 block">Grade Level</Label>
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
          </div>
          
          <Button
            onClick={handleGenerateQuestions}
            className="bg-quiz-teal text-white"
            disabled={isGeneratingQuestions}
          >
            {isGeneratingQuestions ? "Generating Questions..." : "Generate Math Questions"}
          </Button>
          
          {generatedQuestions && (
            <div className="mt-4">
              <Label htmlFor="generatedQuestions">Generated Questions</Label>
              <div className="relative">
                <Textarea
                  id="generatedQuestions"
                  className="min-h-[200px] font-mono text-sm"
                  value={generatedQuestions}
                  readOnly
                />
                <Button
                  className="absolute top-2 right-2 bg-quiz-purple"
                  size="sm"
                  onClick={handleCopyQuestions}
                >
                  Copy All
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Copy these questions to use when creating a new quiz.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionGeneratorTab;
