
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccessCodeCardProps {
  className?: string;
  title: string;
  accessCode: string;
  onCopy?: () => void;
}

const AccessCodeCard: React.FC<AccessCodeCardProps> = ({ 
  className = "", 
  title, 
  accessCode,
  onCopy 
}) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(accessCode);
    if (onCopy) onCopy();
  };

  return (
    <Card className={`overflow-hidden card-hover ${className}`}>
      <CardHeader className="bg-gradient-to-r from-quiz-purple to-quiz-teal p-4">
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-quiz-light p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-500 mb-1">Access Code:</p>
          <p className="access-code text-xl font-bold text-quiz-purple">{accessCode}</p>
        </div>
        <Button 
          onClick={handleCopyClick} 
          variant="outline" 
          className="w-full border-quiz-teal text-quiz-teal hover:bg-quiz-light"
        >
          Copy Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccessCodeCard;
