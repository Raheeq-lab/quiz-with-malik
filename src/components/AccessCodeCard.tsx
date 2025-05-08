
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface AccessCodeCardProps {
  title: string;
  accessCode: string;
  onCopy: () => void;
  subject?: "math" | "english" | "ict";
}

const AccessCodeCard: React.FC<AccessCodeCardProps> = ({ title, accessCode, onCopy, subject = "math" }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    // Ensure we have an access code to copy
    if (accessCode?.trim()) {
      navigator.clipboard.writeText(accessCode.trim().toUpperCase());
      setCopied(true);
      onCopy();
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Get color based on subject
  const getSubjectColor = () => {
    switch (subject) {
      case "math": return "border-l-purple-500 bg-gradient-to-br from-white to-purple-50";
      case "english": return "border-l-green-500 bg-gradient-to-br from-white to-green-50";
      case "ict": return "border-l-orange-500 bg-gradient-to-br from-white to-orange-50";
      default: return "border-l-purple-500 bg-gradient-to-br from-white to-purple-50";
    }
  };

  // Get icon color based on subject
  const getIconColor = () => {
    switch (subject) {
      case "math": return "text-purple-500";
      case "english": return "text-green-500";
      case "ict": return "text-orange-500";
      default: return "text-purple-500";
    }
  };
  
  return (
    <Card className={`border-l-4 ${getSubjectColor()} shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Access Code</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 border border-gray-300 rounded-md font-mono text-xl tracking-wider px-4 py-2">
            {accessCode ? accessCode.toUpperCase() : '------'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full gap-2 ${getIconColor()}`}
          onClick={handleCopy}
          disabled={!accessCode}
        >
          <Copy size={16} />
          {copied ? "Copied!" : "Copy Code"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessCodeCard;
