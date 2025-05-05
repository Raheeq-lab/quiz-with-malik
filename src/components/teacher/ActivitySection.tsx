
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ActivitySettings } from '@/types/quiz';

interface ActivitySectionProps {
  activity: ActivitySettings;
  onChange: (updatedActivity: ActivitySettings) => void;
  index: number;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activity, onChange, index }) => {
  const handleActivityTypeChange = (value: string) => {
    // Convert string value to proper type
    const activityType = value as "teacher-led" | "print-practice" | "student-devices" | "game";
    onChange({
      ...activity,
      activityType
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Activity Type</Label>
        <Select
          value={activity.activityType}
          onValueChange={handleActivityTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teacher-led">Teacher-Led Activity</SelectItem>
            <SelectItem value="print-practice">Print Practice</SelectItem>
            <SelectItem value="student-devices">Student Devices</SelectItem>
            <SelectItem value="game">Interactive Game</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 mb-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id={`team-mode-${index}`}
            checked={activity.teamMode.enabled || false}
            onCheckedChange={(checked) => {
              onChange({
                ...activity,
                teamMode: {
                  ...activity.teamMode,
                  enabled: checked
                }
              });
            }}
          />
          <Label htmlFor={`team-mode-${index}`}>Team Mode</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id={`scoring-${index}`}
            checked={activity.scoring.enabled || false}
            onCheckedChange={(checked) => {
              onChange({
                ...activity,
                scoring: {
                  ...activity.scoring,
                  enabled: checked
                }
              });
            }}
          />
          <Label htmlFor={`scoring-${index}`}>Scoring</Label>
        </div>
      </div>

      {activity.scoring.enabled && (
        <div>
          <Label>Scoring Type</Label>
          <RadioGroup 
            value={activity.scoring.type || "points"}
            onValueChange={(value) => {
              onChange({
                ...activity,
                scoring: {
                  ...activity.scoring,
                  type: value as "points" | "badges"
                }
              });
            }}
            className="flex items-center space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="points" id={`scoring-points-${index}`} />
              <Label htmlFor={`scoring-points-${index}`}>Points</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="badges" id={`scoring-badges-${index}`} />
              <Label htmlFor={`scoring-badges-${index}`}>Badges</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default ActivitySection;
