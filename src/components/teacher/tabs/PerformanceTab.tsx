
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LeaderboardComponent from '@/components/LeaderboardComponent';
import { Book, Users, Clock } from "lucide-react";
import { Quiz, LeaderboardEntry } from '@/types/quiz';

interface PerformanceTabProps {
  quizzes: Quiz[];
  getTotalStudents: () => number;
  getTotalCompletions: () => number;
  getLeaderboardEntries: (quizId: string) => LeaderboardEntry[];
  findQuizById: (id: string) => Quiz | undefined;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ 
  quizzes, 
  getTotalStudents, 
  getTotalCompletions,
  getLeaderboardEntries,
  findQuizById
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Book className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold">{quizzes.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{getTotalStudents()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quiz Completions</p>
              <p className="text-2xl font-bold">{getTotalCompletions()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Quiz Leaderboards</h3>
      
      <div className="space-y-4">
        {quizzes.length > 0 ? (
          <div>
            <Label htmlFor="quizSelect">Select Quiz</Label>
            <div className="flex gap-4">
              <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a quiz" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes.map(quiz => (
                    <SelectItem key={quiz.id} value={quiz.id}>{quiz.title} (Grade {quiz.gradeLevel})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedQuizId && (
              <div className="mt-4">
                <LeaderboardComponent 
                  entries={getLeaderboardEntries(selectedQuizId)} 
                  quizTitle={findQuizById(selectedQuizId)?.title}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-quiz-light rounded-lg">
            <p className="text-gray-500">No quiz data available yet.</p>
            <p className="text-gray-500">Create a quiz and have students take it to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTab;
