
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  BookOpen, 
  Users, 
  Award,
  Laptop,
  BookText
} from "lucide-react";
import NavBar from '@/components/NavBar';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Malik's Learning Lab
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            An interactive platform for students to learn Math, English, and ICT through engaging quizzes and lessons
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/student-join">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Join as Student
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/teacher-signup">
              <Button size="lg" variant="outline">
                Sign Up as Teacher
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Subjects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Math */}
            <div className="border rounded-lg p-8 text-center hover:border-purple-300 hover:shadow-md transition-all">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-500 mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Mathematics</h3>
              <p className="text-gray-500 mb-6">
                Engaging math concepts from arithmetic to algebra through interactive quizzes and lessons.
              </p>
              <div className="text-sm text-gray-400">
                Grades 3-10
              </div>
            </div>
            
            {/* English */}
            <div className="border rounded-lg p-8 text-center hover:border-green-300 hover:shadow-md transition-all">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500 mb-4">
                <BookText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-green-700">English</h3>
              <p className="text-gray-500 mb-6">
                Vocabulary, grammar, and reading comprehension through picture-based lessons and quizzes.
              </p>
              <div className="text-sm text-gray-400">
                Grades 3-10
              </div>
            </div>
            
            {/* ICT */}
            <div className="border rounded-lg p-8 text-center hover:border-orange-300 hover:shadow-md transition-all">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-orange-700">ICT</h3>
              <p className="text-gray-500 mb-6">
                Computer hardware, software, and digital literacy through interactive lessons and quizzes.
              </p>
              <div className="text-sm text-gray-400">
                Grades 3-10
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Malik's Learning Lab makes it easy for teachers to create engaging learning content
            and for students to learn through interactive experiences
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                <div className="text-lg font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Content</h3>
              <p className="text-gray-600">
                Teachers create quizzes and interactive lessons across multiple subjects and grade levels.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                <div className="text-lg font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Access Code</h3>
              <p className="text-gray-600">
                Every quiz and lesson gets a unique 6-digit code that teachers share with their students.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                <div className="text-lg font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn & Assess</h3>
              <p className="text-gray-600">
                Students join using the code, complete activities, and get immediate feedback on their progress.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Teacher Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">For Teachers</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7L6 10L11 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium block">Quiz Zone</span>
                    <span className="text-gray-500 text-sm">Create multiple choice, true/false, and other quiz types across all subjects</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7L6 10L11 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium block">Lesson Builder</span>
                    <span className="text-gray-500 text-sm">Design interactive picture-based lessons with text, images, and exercises</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 h-6 w-6 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7L6 10L11 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium block">Performance Tracking</span>
                    <span className="text-gray-500 text-sm">Monitor student progress and identify areas for improvement</span>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/teacher-signup">
                  <Button size="lg">
                    Create Teacher Account
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative h-96">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-100 rounded-lg transform rotate-3"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-white border rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Quiz Creator</h3>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">Math Quiz</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Question 1</label>
                    <div className="mt-1 p-3 border rounded-md bg-gray-50">
                      What is the sum of 28 + 14?
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 border rounded flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">A</div>
                      <span>42</span>
                    </div>
                    <div className="p-2 border rounded flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs">B</div>
                      <span>32</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Student Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits for Students</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-500 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Feedback</h3>
              <p className="text-gray-600">
                Students receive immediate results and explanations after completing quizzes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500 mb-4">
                <BookText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Engage with visual content and interactive exercises across multiple subjects.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Access</h3>
              <p className="text-gray-600">
                Join quizzes and lessons with simple 6-digit codes on any device.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/student-join">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Join a Quiz or Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Malik's Learning Lab</h2>
            <p className="text-gray-400 mb-6">
              Transforming education through interactive learning experiences
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
            </div>
            <div className="mt-8 text-gray-500 text-sm">
              &copy; 2025 Malik's Learning Lab. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
