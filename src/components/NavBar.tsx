
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  return (
    <nav className="w-full bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-quiz-purple text-white font-bold rounded-lg p-2">Q</div>
          <span className="font-bold text-xl text-quiz-dark">QuizHub</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/student-join">
            <Button variant="outline" className="border-quiz-teal text-quiz-teal hover:text-quiz-teal hover:bg-quiz-light">
              Join as Student
            </Button>
          </Link>
          <Link to="/teacher-signup">
            <Button className="bg-quiz-purple hover:bg-opacity-90 text-white">
              Teacher Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
