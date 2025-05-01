
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import GradeSelector from './GradeSelector';

const TeacherSignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGradeChange = (grade: number) => {
    setSelectedGrades(prev => {
      if (prev.includes(grade)) {
        return prev.filter(g => g !== grade);
      } else {
        return [...prev, grade].sort((a, b) => a - b);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (selectedGrades.length === 0) {
      toast({
        title: "No grades selected",
        description: "Please select at least one grade level you teach.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate signup process
    setTimeout(() => {
      // In a real app, this would be an API call to Firebase
      toast({
        title: "Account created!",
        description: "Welcome to Math with Malik. You can now create and manage math quizzes.",
      });
      
      // Store mock user data (in a real app, this would be handled by Firebase authentication)
      localStorage.setItem('mathWithMalikTeacher', JSON.stringify({
        id: 'teacher-' + Date.now(),
        name: formData.name,
        email: formData.email,
        school: formData.school,
        grades: selectedGrades,
        isAuthenticated: true
      }));
      
      setIsLoading(false);
      navigate('/teacher-dashboard');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@school.edu"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="school">School Name</Label>
        <Input
          id="school"
          name="school"
          placeholder="Lincoln Elementary"
          required
          value={formData.school}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <GradeSelector 
        selectedGrades={selectedGrades}
        onGradeChange={handleGradeChange}
      />
      
      <Button
        type="submit"
        className="w-full bg-quiz-purple hover:bg-opacity-90"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <a href="#" className="text-quiz-teal hover:underline">
          Sign In
        </a>
      </p>
    </form>
  );
};

export default TeacherSignupForm;
