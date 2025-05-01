
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from '@/components/NavBar';
import TeacherSignupForm from '@/components/teacher/TeacherSignupForm';
import SignupImageSection from '@/components/teacher/SignupImageSection';

const TeacherSignup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex flex-col lg:flex-row bg-quiz-light">
        <div className="lg:w-1/2 p-4 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl gradient-text">Math Teacher Sign Up</CardTitle>
              <CardDescription>
                Create an account to build math quizzes for your students
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TeacherSignupForm />
            </CardContent>
          </Card>
        </div>
        
        <SignupImageSection />
      </main>
    </div>
  );
};

export default TeacherSignup;
