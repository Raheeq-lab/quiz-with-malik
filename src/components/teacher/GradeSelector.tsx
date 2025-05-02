
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GradeSelectorProps {
  selectedGrades: number[];
  onChange: (grades: number[]) => void;  // Changed from onGradeChange to onChange
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrades, onChange }) => {
  const grades = [3, 4, 5, 6, 7, 8, 9, 10];
  
  const handleGradeChange = (grade: number) => {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter(g => g !== grade));
    } else {
      onChange([...selectedGrades, grade]);
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
