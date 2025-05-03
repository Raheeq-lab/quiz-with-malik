
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GradeSelectorProps {
  selectedGrades: number[];
  onChange: (grades: number[]) => void;  
  subject?: "math" | "english" | "ict";
  availableGrades?: number[]; // Added this prop
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ 
  selectedGrades, 
  onChange, 
  subject = "math",
  availableGrades = [3, 4, 5, 6, 7, 8, 9, 10] // Default if not provided
}) => {
  const grades = availableGrades;
  
  const handleGradeChange = (grade: number) => {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter(g => g !== grade));
    } else {
      onChange([...selectedGrades, grade]);
    }
  };

  // Get color based on subject
  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "text-purple-700 border-purple-300 bg-purple-50";
      case "english": return "text-green-700 border-green-300 bg-green-50";
      case "ict": return "text-orange-700 border-orange-300 bg-orange-50";
      default: return "text-purple-700 border-purple-300 bg-purple-50";
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Grade Levels You Teach</Label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {grades.map(grade => (
          <div key={grade} className="flex items-center space-x-2">
            <Checkbox 
              id={`grade-${grade}`} 
              checked={selectedGrades.includes(grade)}
              onCheckedChange={() => handleGradeChange(grade)}
              className={selectedGrades.includes(grade) ? getSubjectColor() : ""}
            />
            <Label htmlFor={`grade-${grade}`} className="cursor-pointer">
              Grade {grade}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeSelector;
