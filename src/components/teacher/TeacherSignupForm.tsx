
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  school: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const TeacherSignupForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      school: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create teacher account with default grades and subjects
    // These will be selected on the dashboard after login
    const teacher = {
      id: `teacher-${Date.now()}`,
      name: values.name,
      email: values.email,
      school: values.school,
      grades: [1, 2, 3], // Default grades
      subjects: ["math", "english", "ict"] as ("math" | "english" | "ict")[], // Default subjects
      // In a real app, we would hash the password
      // This is just for demo purposes
      passwordHash: values.password
    };
    
    // Store in localStorage (in a real app, this would be a server API call)
    const teachersStr = localStorage.getItem('mathWithMalikTeachers');
    const teachers = teachersStr ? JSON.parse(teachersStr) : [];
    
    // Check if email already exists
    if (teachers.some((t: any) => t.email === values.email)) {
      toast({
        title: "Email already registered",
        description: "This email is already in use. Please use a different one or sign in.",
        variant: "destructive",
      });
      return;
    }
    
    teachers.push(teacher);
    localStorage.setItem('mathWithMalikTeachers', JSON.stringify(teachers));
    
    // Log the teacher in
    localStorage.setItem('mathWithMalikTeacher', JSON.stringify(teacher));
    
    toast({
      title: "Account created successfully!",
      description: "Welcome to Malik's Learning Lab! You are now signed in.",
    });
    
    navigate('/teacher-dashboard');
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="teacher@school.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Springfield Elementary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 6 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Teacher Account
        </Button>
      </form>
    </Form>
  );
};

export default TeacherSignupForm;
