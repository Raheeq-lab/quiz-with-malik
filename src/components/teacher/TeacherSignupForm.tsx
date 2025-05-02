
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import GradeSelector from './GradeSelector';

const TeacherSignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [grades, setGrades] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (grades.length === 0) {
      toast({
        title: "Grades required",
        description: "Please select at least one grade level you teach.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const teacherId = `teacher-${Date.now()}`;
    const teacherData = {
      id: teacherId,
      name,
      email,
      school,
      grades,
      createdAt: new Date().toISOString()
    };
    
    // Store teacher data in two places:
    // 1. As the currently logged in teacher
    localStorage.setItem('mathWithMalikTeacher', JSON.stringify(teacherData));
    
    // 2. In a list of all teachers for the sign-in functionality
    const storedTeachers = localStorage.getItem('mathWithMalikTeachers');
    const teachers = storedTeachers ? JSON.parse(storedTeachers) : [];
    teachers.push(teacherData);
    localStorage.setItem('mathWithMalikTeachers', JSON.stringify(teachers));
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Your teacher account has been successfully created.",
      });
      navigate('/teacher-dashboard');
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <Input
          id="name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@school.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="school" className="block text-sm font-medium">
          School Name (Optional)
        </label>
        <Input
          id="school"
          placeholder="Your School's Name"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium mb-2">
          Which Grades Do You Teach?
        </label>
        <GradeSelector 
          selectedGrades={grades} 
          onChange={setGrades} 
        />
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms and conditions
        </label>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-quiz-purple hover:bg-opacity-90"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Teacher Account"}
      </Button>
    </form>
  );
};

export default TeacherSignupForm;
