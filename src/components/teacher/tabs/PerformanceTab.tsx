
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LeaderboardComponent from '@/components/LeaderboardComponent';
import { Quiz, LeaderboardEntry } from '@/types/quiz';
import { BarChart, BookOpen, BookText, Laptop } from 'lucide-react';

interface PerformanceTabProps {
  quizzes: Quiz[];
  getTotalStudents: () => number;
  getTotalCompletions: () => number;
  getLeaderboardEntries: (quizId: string) => LeaderboardEntry[];
  findQuizById: (id: string) => Quiz | undefined;
  subject?: "math" | "english" | "ict";
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({
  quizzes,
  getTotalStudents,
  getTotalCompletions,
  getLeaderboardEntries,
  findQuizById,
  subject = "math"
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  
  // Filter quizzes by selected subject
  const filteredQuizzes = quizzes.filter(quiz => quiz.subject === subject);
  const leaderboard = selectedQuizId ? getLeaderboardEntries(selectedQuizId) : [];
  const selectedQuiz = selectedQuizId ? findQuizById(selectedQuizId) : undefined;

  // Get color based on subject
  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "border-l-purple-500 from-purple-50 to-white";
      case "english": return "border-l-green-500 from-green-50 to-white";
      case "ict": return "border-l-orange-500 from-orange-50 to-white";
      default: return "border-l-purple-500 from-purple-50 to-white";
    }
  };

  const getSubjectHeaderColor = () => {
    switch (subject) {
      case "math": return "text-purple-700";
      case "english": return "text-green-700";
      case "ict": return "text-orange-700";
      default: return "text-purple-700";
    }
  };

  const getSubjectIcon = () => {
    switch (subject) {
      case "math": return <BookOpen size={20} className="text-purple-500" />;
      case "english": return <BookText size={20} className="text-green-500" />;
      case "ict": return <Laptop size={20} className="text-orange-500" />;
      default: return <BookOpen size={20} className="text-purple-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart size={20} className={getSubjectHeaderColor()} />
        <h2 className="text-xl font-semibold">{subject.charAt(0).toUpperCase() + subject.slice(1)} Performance Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`border-l-4 ${getSubjectColor()} bg-gradient-to-r`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{getTotalStudents()}</CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className={`border-l-4 ${getSubjectColor()} bg-gradient-to-r`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{getTotalCompletions()}</CardTitle>
            <CardDescription>Total Quiz Completions</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className={`border-l-4 ${getSubjectColor()} bg-gradient-to-r`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredQuizzes.length}</CardTitle>
            <CardDescription>Total {subject.charAt(0).toUpperCase() + subject.slice(1)} Quizzes</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Leaderboard</CardTitle>
              <CardDescription>View top performers for each quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Select Quiz</label>
                  <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredQuizzes.map(quiz => (
                        <SelectItem key={quiz.id} value={quiz.id}>{quiz.title} (Grade {quiz.gradeLevel})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedQuizId && leaderboard.length > 0 ? (
                  <LeaderboardComponent 
                    entries={leaderboard} 
                    quizTitle={selectedQuiz?.title || "Quiz"} 
                  />
                ) : selectedQuizId ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No results for this quiz yet.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center mb-2">
                      {getSubjectIcon()}
                    </div>
                    <p className="text-gray-500">Select a quiz to view its leaderboard.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Insights into student performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Detailed analytics coming soon!</p>
                <p className="text-sm text-gray-400">This feature is under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceTab;
