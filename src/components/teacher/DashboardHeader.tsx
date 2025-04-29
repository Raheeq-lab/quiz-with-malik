
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  teacherName: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ teacherName, onLogout }) => {
  return (
    <header className="bg-quiz-purple text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white text-quiz-purple font-bold rounded-lg p-2">M</div>
          <span className="font-bold text-xl">Math with Malik</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Welcome, {teacherName}</span>
          <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
