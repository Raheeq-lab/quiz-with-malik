
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get teacher data from localStorage
    const teachersStr = localStorage.getItem('mathWithMalikTeachers');
    const teachers = teachersStr ? JSON.parse(teachersStr) : [];
    
    // Find teacher with matching email
    const teacher = teachers.find((t: any) => t.email === email);
    
    if (teacher) {
      // In a real app, we would check the password properly
      // For this demo, we'll just check if it exists
      if (password) {
        localStorage.setItem('mathWithMalikTeacher', JSON.stringify(teacher));
        setShowSignInDialog(false);
        toast({
          title: "Sign in successful!",
          description: "Welcome back to Malik's Learning Lab",
        });
        navigate('/teacher-dashboard');
      } else {
        toast({
          title: "Sign in failed",
          description: "Please check your password",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Teacher not found",
        description: "Please check your email or sign up",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white border-b py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Malik's Learning Lab</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Subjects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-1 gap-3 p-4 w-[200px]">
                    <NavigationMenuLink asChild>
                      <Link to="/?subject=math" className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Mathematics</span>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/?subject=english" className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>English</span>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/?subject=ict" className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>ICT</span>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/student-join">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Join Quiz</Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Button 
            variant="outline" 
            onClick={() => setShowSignInDialog(true)}
          >
            Sign In
          </Button>
          
          <Link to="/teacher-signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
        
        <div className="md:hidden space-x-2">
          <Link to="/student-join">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Join Quiz</Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowSignInDialog(true)}
          >
            Sign In
          </Button>
        </div>
      </div>
      
      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In to Malik's Learning Lab</DialogTitle>
            <DialogDescription>
              Enter your email and password to access your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignIn}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowSignInDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Sign In</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default NavBar;
