
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardEntry } from '@/types/quiz';
import { Award, Clock } from "lucide-react";

interface LeaderboardComponentProps {
  entries: LeaderboardEntry[];
  quizTitle?: string;
}

const LeaderboardComponent: React.FC<LeaderboardComponentProps> = ({ entries, quizTitle }) => {
  // Sort entries by score first, then by time taken (ascending)
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.timeTaken - b.timeTaken;
  });
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-quiz-purple to-quiz-teal p-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Award size={20} />
          {quizTitle ? `${quizTitle} Leaderboard` : 'Leaderboard'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedEntries.length > 0 ? (
          <div className="divide-y">
            {sortedEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-4 ${
                  index === 0 ? 'bg-yellow-50' : 
                  index === 1 ? 'bg-gray-50' : 
                  index === 2 ? 'bg-orange-50' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  index === 0 ? 'bg-yellow-200 text-yellow-800' : 
                  index === 1 ? 'bg-gray-200 text-gray-800' : 
                  index === 2 ? 'bg-orange-200 text-orange-800' : 
                  'bg-quiz-light text-quiz-dark'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.studentName}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Score: {entry.score}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(entry.timeTaken)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No entries yet. Be the first to complete this quiz!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardComponent;
