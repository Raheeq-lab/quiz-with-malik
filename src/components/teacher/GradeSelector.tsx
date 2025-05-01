
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GradeSelectorProps {
  selectedGrades: number[];
  onGradeChange: (grade: number) => void;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrades, onGradeChange }) => {
  const grades = [3, 4, 5, 6, 7, 8, 9, 10];
  
  return (
    <div className="space-y-2">
      <Label>Grade Levels You Teach</Label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {grades.map(grade => (
          <div key={grade} className="flex items-center space-x-2">
            <Checkbox 
              id={`grade-${grade}`} 
              checked={selectedGrades.includes(grade)}
              onCheckedChange={() => onGradeChange(grade)}
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
