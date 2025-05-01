
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavBar from '@/components/NavBar';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-quiz-purple to-quiz-teal py-20 px-4">
          <div className="container mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to Math with Malik
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Interactive math quizzes and Olympiad contests for students in grades 3-10.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/teacher-signup">
                <Button size="lg" className="bg-white text-quiz-purple hover:bg-quiz-light">
                  Sign Up as Teacher
                </Button>
              </Link>
              <Link to="/student-join">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Join a Quiz
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Image Section */}
        <section className="py-10 px-4 bg-white">
          <div className="container mx-auto">
            <div className="rounded-lg overflow-hidden shadow-xl max-w-5xl mx-auto">
              <img 
                src="/lovable-uploads/c498bc13-c877-4138-8b03-fd022c61fcfc.png" 
                alt="Students participating in math olympiad" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* For Teachers */}
              <div className="bg-quiz-light p-6 rounded-lg shadow-sm text-center card-hover">
                <div className="w-16 h-16 bg-quiz-purple rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-quiz-purple">Teachers Create Quizzes</h3>
                <p className="text-gray-600">
                  Math teachers design multiple-choice quizzes with custom questions for different grade levels.
                </p>
              </div>
              
              {/* Share Quiz Code */}
              <div className="bg-quiz-light p-6 rounded-lg shadow-sm text-center card-hover">
                <div className="w-16 h-16 bg-quiz-teal rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-quiz-teal">Share Quiz Code</h3>
                <p className="text-gray-600">
                  Each quiz gets a unique access code that teachers share with their students.
                </p>
              </div>
              
              {/* Students Take Quiz */}
              <div className="bg-quiz-light p-6 rounded-lg shadow-sm text-center card-hover">
                <div className="w-16 h-16 bg-quiz-purple rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-quiz-purple">Students Take Quiz</h3>
                <p className="text-gray-600">
                  Students enter the quiz code, answer questions with a timer, and see their scores on the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-quiz-light">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Ready to Make Math Fun?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              Join our platform to create engaging math quizzes and Olympiad contests for your students.
            </p>
            <Link to="/teacher-signup">
              <Button size="lg" className="bg-quiz-purple hover:bg-opacity-90 text-white">
                Sign Up Now - It's Free!
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-quiz-dark text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Math with Malik. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
