
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BookOpen, BookText, Laptop } from "lucide-react";

interface SubjectSelectorProps {
  selectedSubject: string;
  onChange: (subject: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ selectedSubject, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Select Subject
      </label>
      <ToggleGroup 
        type="single" 
        value={selectedSubject} 
        onValueChange={(value) => {
          if (value) onChange(value);
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="math" aria-label="Mathematics" className="flex items-center gap-2 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700">
          <BookOpen className="w-4 h-4" />
          <span>Math</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="english" aria-label="English" className="flex items-center gap-2 data-[state=on]:bg-green-100 data-[state=on]:text-green-700">
          <BookText className="w-4 h-4" />
          <span>English</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="ict" aria-label="ICT" className="flex items-center gap-2 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-700">
          <Laptop className="w-4 h-4" />
          <span>ICT</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SubjectSelector;
