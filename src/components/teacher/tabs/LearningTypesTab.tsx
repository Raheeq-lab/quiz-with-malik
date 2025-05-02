
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LearningTypeCards from '../LearningTypeCards';

interface LearningTypesTabProps {
  subject: "math" | "english" | "ict";
}

const LearningTypesTab: React.FC<LearningTypesTabProps> = ({ subject }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Learning Types</h1>
          <p className="text-muted-foreground mt-1">
            Explore and create activities based on different learning methodologies
          </p>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to Malik's Learning Lab!</CardTitle>
          <CardDescription>
            Each learning type offers a unique approach to teaching. Select a card below to view details and create activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Students learn differently. These learning types are designed to engage students through various 
            teaching methodologies tailored to each subject area.
          </p>
          <Button variant="outline" className="mr-2">View Teacher Guide</Button>
          <Button>Create Activity</Button>
        </CardContent>
      </Card>

      <LearningTypeCards subject={subject} />
    </div>
  );
};

export default LearningTypesTab;
