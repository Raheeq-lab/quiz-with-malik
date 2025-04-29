
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';

const TeacherSignup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    // Simulate signup process
    setTimeout(() => {
      // In a real app, this would be an API call
      toast({
        title: "Account created!",
        description: "Welcome to QuizHub. You can now create and manage quizzes.",
      });
      
      // Store mock user data (in a real app, this would be handled by authentication system)
      localStorage.setItem('quizHubTeacher', JSON.stringify({
        id: 'teacher-' + Date.now(),
        name: formData.name,
        email: formData.email,
        isAuthenticated: true
      }));
      
      setIsLoading(false);
      navigate('/teacher-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-quiz-light">
        <Card className="w-full max-w-md shadow-lg card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Teacher Sign Up</CardTitle>
            <CardDescription>
              Create an account to start building quizzes for your students
            </CardDescription>
          </CardHeader>
          
          <CardContent>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherSignup;
