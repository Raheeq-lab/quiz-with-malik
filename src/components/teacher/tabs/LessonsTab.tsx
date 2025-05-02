
import React from 'react';
import { Button } from "@/components/ui/button";
import AccessCodeCard from '@/components/AccessCodeCard';
import { Lesson } from '@/types/quiz';
import { FileText, BookOpen, Laptop, BookText } from "lucide-react";

interface LessonsTabProps {
  lessons: Lesson[];
  onCreateLesson: () => void;
  onCopyCode: (lessonTitle: string) => void;
  subject: "math" | "english" | "ict";
}

const LessonsTab: React.FC<LessonsTabProps> = ({ lessons, onCreateLesson, onCopyCode, subject }) => {
  const getSubjectIcon = () => {
    switch (subject) {
      case "math": return <BookOpen size={18} className="text-purple-500" />;
      case "english": return <BookText size={18} className="text-green-500" />;
      case "ict": return <Laptop size={18} className="text-orange-500" />;
      default: return <BookOpen size={18} className="text-purple-500" />;
    }
  };

  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "bg-purple-600 hover:bg-purple-700";
      case "english": return "bg-green-600 hover:bg-green-700";
      case "ict": return "bg-orange-600 hover:bg-orange-700";
      default: return "bg-purple-600 hover:bg-purple-700";
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {getSubjectIcon()}
          <span>My {subject.charAt(0).toUpperCase() + subject.slice(1)} Lessons</span>
        </h2>
        <Button 
          onClick={onCreateLesson}
          className={`text-white ${getSubjectColor()}`}
        >
          <FileText size={16} className="mr-2" />
          Create New Lesson
        </Button>
      </div>
      
      {lessons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">You haven't created any lessons for this subject yet.</p>
          <p className="text-gray-500 mb-4">Get started by creating your first interactive lesson!</p>
          <Button 
            onClick={onCreateLesson}
            className={`text-white ${getSubjectColor()}`}
          >
            Create New Lesson
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map(lesson => (
            <AccessCodeCard
              key={lesson.id}
              title={`${lesson.title} (Grade ${lesson.gradeLevel})`}
              accessCode={lesson.accessCode}
              onCopy={() => onCopyCode(lesson.title)}
              subject={lesson.subject}
            />
          ))}
        </div>
      )}
      
      {/* Example lessons section */}
      {lessons.length === 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-medium mb-4">Example {subject.charAt(0).toUpperCase() + subject.slice(1)} Lessons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject === "english" && (
              <>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-medium">Picture Description</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Show an image and ask students to describe what they see.</p>
                  <img 
                    src="https://images.unsplash.com/photo-1500673922987-e212871fec22" 
                    alt="Example" 
                    className="w-full h-32 object-cover rounded-md mb-2" 
                  />
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-medium">Vocabulary Builder</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Students identify and define words from context.</p>
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                    alt="Example" 
                    className="w-full h-32 object-cover rounded-md mb-2" 
                  />
                </div>
              </>
            )}
            
            {subject === "ict" && (
              <>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-medium">Hardware Components</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Label different parts of a computer system.</p>
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
                    alt="Example" 
                    className="w-full h-32 object-cover rounded-md mb-2" 
                  />
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-medium">Coding Concepts</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Introduce basic programming concepts visually.</p>
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
                    alt="Example" 
                    className="w-full h-32 object-cover rounded-md mb-2" 
                  />
                </div>
              </>
            )}
            
            {subject === "math" && (
              <>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-medium">Geometry Basics</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Identify and classify different types of shapes.</p>
                  <div className="flex justify-center space-x-4 my-4">
                    <div className="w-12 h-12 bg-purple-200 rounded-full"></div>
                    <div className="w-12 h-12 bg-purple-300 triangle"></div>
                    <div className="w-12 h-12 bg-purple-400"></div>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="font-medium">Fractions Tutorial</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Visual representation of fractions and operations.</p>
                  <div className="grid grid-cols-4 gap-1 my-4">
                    <div className="h-8 bg-purple-500"></div>
                    <div className="h-8 bg-purple-500"></div>
                    <div className="h-8 bg-gray-200"></div>
                    <div className="h-8 bg-gray-200"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsTab;
