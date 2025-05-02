
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if teacher exists in localStorage
    const storedTeachers = localStorage.getItem('mathWithMalikTeachers');
    const teachers = storedTeachers ? JSON.parse(storedTeachers) : [];
    const matchingTeacher = teachers.find((t: any) => t.email === email);

    if (matchingTeacher) {
      // In a real app, you would verify the password here
      // For this demo, we'll simply set the teacher as logged in
      localStorage.setItem('mathWithMalikTeacher', JSON.stringify(matchingTeacher));
      
      setTimeout(() => {
        setIsLoading(false);
        setIsSignInOpen(false);
        toast({
          title: "Signed in successfully",
          description: "Welcome back to Math with Malik!",
        });
        navigate('/teacher-dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Sign in failed",
          description: "Email not found. Please sign up first.",
          variant: "destructive",
        });
      }, 1000);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-quiz-purple text-white font-bold rounded-lg p-2">M</div>
          <span className="font-bold text-xl text-quiz-dark">Math with Malik</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/student-join">
            <Button 
              variant="outline" 
              className="border-quiz-teal bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
              Join Quiz
            </Button>
          </Link>
          <Button 
            onClick={() => setIsSignInOpen(true)} 
            variant="outline" 
            className="border-quiz-purple text-quiz-purple hover:bg-quiz-light"
          >
            Sign In
          </Button>
          <Link to="/teacher-signup">
            <Button className="bg-quiz-purple hover:bg-opacity-90 text-white">
              Teacher Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Sign In Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center gradient-text">Teacher Sign In</DialogTitle>
            <DialogDescription className="text-center">
              Sign in to access your quizzes and student results
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="teacher@school.edu" 
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsSignInOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-quiz-purple" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default NavBar;
