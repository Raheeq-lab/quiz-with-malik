
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { User, FileText, Laptop, Users, Trophy, BadgeCheck } from 'lucide-react';
import { ActivitySettings, TeamInfo } from '@/types/quiz';

interface ActivitySectionProps {
  activity: ActivitySettings;
  onChange: (activity: ActivitySettings) => void;
}

const teamColors = [
  { name: "Red", value: "#f87171" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Green", value: "#4ade80" },
  { name: "Yellow", value: "#facc15" },
  { name: "Purple", value: "#c084fc" },
  { name: "Orange", value: "#fb923c" }
];

const teamEmojis = ["🌟", "🚀", "🦁", "🐯", "🐘", "🦊", "🐬", "🦉", "🦄", "🐢", "🐙", "🦋"];

const ActivitySection: React.FC<ActivitySectionProps> = ({ activity, onChange }) => {
  const [activityType, setActivityType] = useState<"teacher-led" | "print-practice" | "student-devices">(
    activity?.activityType || "teacher-led"
  );
  const [teamModeEnabled, setTeamModeEnabled] = useState<boolean>(activity?.teamMode?.enabled || false);
  const [numberOfTeams, setNumberOfTeams] = useState<number>(activity?.teamMode?.numberOfTeams || 2);
  const [teams, setTeams] = useState<TeamInfo[]>(
    activity?.teamMode?.teams || Array(2).fill(0).map((_, i) => ({
      id: `team-${Date.now()}-${i}`,
      name: `Team ${i + 1}`,
      color: teamColors[i % teamColors.length].value,
      emoji: teamEmojis[i % teamEmojis.length]
    }))
  );
  const [scoringEnabled, setScoringEnabled] = useState<boolean>(activity?.scoring?.enabled || false);
  const [scoringType, setScoringType] = useState<"points" | "badges">(activity?.scoring?.type || "points");

  const handleActivityTypeChange = (value: "teacher-led" | "print-practice" | "student-devices") => {
    setActivityType(value);
    
    const updatedActivity: ActivitySettings = {
      ...activity,
      activityType: value
    };
    
    onChange(updatedActivity);
  };

  const handleTeamModeToggle = (enabled: boolean) => {
    setTeamModeEnabled(enabled);
    
    const updatedActivity: ActivitySettings = {
      ...activity,
      teamMode: {
        ...activity.teamMode,
        enabled,
        numberOfTeams: enabled ? numberOfTeams : undefined,
        teams: enabled ? teams : undefined
      }
    };
    
    onChange(updatedActivity);
  };

  const handleNumberOfTeamsChange = (value: number) => {
    // Ensure number is between 2 and 6
    const teamsCount = Math.min(Math.max(2, value), 6);
    setNumberOfTeams(teamsCount);
    
    // Adjust teams array length
    let updatedTeams = [...teams];
    
    // If we need more teams
    if (teamsCount > teams.length) {
      for (let i = teams.length; i < teamsCount; i++) {
        updatedTeams.push({
          id: `team-${Date.now()}-${i}`,
          name: `Team ${i + 1}`,
          color: teamColors[i % teamColors.length].value,
          emoji: teamEmojis[i % teamEmojis.length]
        });
      }
    } 
    // If we need fewer teams
    else if (teamsCount < teams.length) {
      updatedTeams = updatedTeams.slice(0, teamsCount);
    }
    
    setTeams(updatedTeams);
    
    const updatedActivity: ActivitySettings = {
      ...activity,
      teamMode: {
        ...activity.teamMode,
        enabled: teamModeEnabled,
        numberOfTeams: teamsCount,
        teams: updatedTeams
      }
    };
    
    onChange(updatedActivity);
  };

  const handleTeamChange = (index: number, field: keyof TeamInfo, value: string) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = { 
      ...updatedTeams[index], 
      [field]: value 
    };
    
    setTeams(updatedTeams);
    
    const updatedActivity: ActivitySettings = {
      ...activity,
      teamMode: {
        ...activity.teamMode,
        teams: updatedTeams
      }
    };
    
    onChange(updatedActivity);
  };

  const handleScoringToggle = (enabled: boolean) => {
    setScoringEnabled(enabled);
    
    const updatedActivity: ActivitySettings = {
      ...activity,
      scoring: {
        ...activity.scoring,
        enabled,
        type: enabled ? scoringType : undefined
      }
    };
    
    onChange(updatedActivity);
  };

  const handleScoringTypeChange = (type: "points" | "badges") => {
    setScoringType(type);
    
    const updatedActivity: ActivitySettings = {
      ...activity,
      scoring: {
        ...activity.scoring,
        type
      }
    };
    
    onChange(updatedActivity);
  };

  return (
    <Card className="border-2 border-purple-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="text-purple-600" />
          Activity Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Activity Type Section */}
        <div className="space-y-3">
          <Label className="text-md font-medium">1. Activity Type (required)</Label>
          <p className="text-sm text-gray-500">How will students complete this lesson?</p>
          
          <RadioGroup 
            value={activityType}
            onValueChange={(value) => handleActivityTypeChange(value as any)} 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
          >
            <div className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
              activityType === "teacher-led" 
                ? "border-purple-500 bg-purple-50" 
                : "border-gray-200 hover:border-purple-300"
            }`}>
              <RadioGroupItem 
                value="teacher-led" 
                id="teacher-led" 
                className="absolute top-4 right-4 text-purple-600"
              />
              <div className="flex items-start">
                <User className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <Label htmlFor="teacher-led" className="text-base font-medium mb-1 block cursor-pointer">
                    Teacher-Led
                  </Label>
                  <p className="text-sm text-gray-600">
                    Activity shown on teacher's screen; students follow along
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
              activityType === "print-practice" 
                ? "border-purple-500 bg-purple-50" 
                : "border-gray-200 hover:border-purple-300"
            }`}>
              <RadioGroupItem 
                value="print-practice" 
                id="print-practice" 
                className="absolute top-4 right-4 text-purple-600"
              />
              <div className="flex items-start">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <Label htmlFor="print-practice" className="text-base font-medium mb-1 block cursor-pointer">
                    Print & Practice
                  </Label>
                  <p className="text-sm text-gray-600">
                    Activity done on paper or worksheets
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
              activityType === "student-devices" 
                ? "border-purple-500 bg-purple-50" 
                : "border-gray-200 hover:border-purple-300"
            }`}>
              <RadioGroupItem 
                value="student-devices" 
                id="student-devices" 
                className="absolute top-4 right-4 text-purple-600"
              />
              <div className="flex items-start">
                <Laptop className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <Label htmlFor="student-devices" className="text-base font-medium mb-1 block cursor-pointer">
                    Student Devices
                  </Label>
                  <p className="text-sm text-gray-600">
                    Activity completed on students' laptops or tablets
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Team Mode Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-md font-medium">2. Team Mode (optional)</Label>
              <p className="text-sm text-gray-500">Students work in teams to complete the lesson</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="team-mode" 
                checked={teamModeEnabled}
                onCheckedChange={handleTeamModeToggle}
              />
              <Label htmlFor="team-mode">Enable Team Mode</Label>
            </div>
          </div>
          
          {teamModeEnabled && (
            <div className="bg-blue-50 p-4 rounded-md space-y-4">
              <div className="flex items-center gap-3">
                <Label htmlFor="number-of-teams">Number of Teams:</Label>
                <Input
                  id="number-of-teams"
                  type="number"
                  min={2}
                  max={6}
                  value={numberOfTeams}
                  onChange={(e) => handleNumberOfTeamsChange(parseInt(e.target.value) || 2)}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">(2-6 teams)</span>
              </div>
              
              <div className="space-y-4">
                {teams.map((team, index) => (
                  <div key={team.id} className="flex items-center gap-3 flex-wrap">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.emoji}
                    </div>
                    
                    <Input
                      value={team.name}
                      onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                      placeholder={`Team ${index + 1}`}
                      className="max-w-[200px]"
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      {teamColors.map((color) => (
                        <Toggle
                          key={color.name}
                          pressed={team.color === color.value}
                          onPressedChange={() => handleTeamChange(index, "color", color.value)}
                          className="w-6 h-6 rounded-full p-0"
                          style={{ backgroundColor: color.value }}
                          aria-label={`${color.name} color`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 ml-auto">
                      {teamEmojis.slice(0, 6).map((emoji) => (
                        <Toggle
                          key={emoji}
                          pressed={team.emoji === emoji}
                          onPressedChange={() => handleTeamChange(index, "emoji", emoji)}
                          className="w-8 h-8 rounded-full bg-white"
                          aria-label={`Emoji ${emoji}`}
                        >
                          {emoji}
                        </Toggle>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Scoring Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-md font-medium">3. Scoring (optional)</Label>
              <p className="text-sm text-gray-500">Award points or badges to teams or students</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="scoring-mode" 
                checked={scoringEnabled}
                onCheckedChange={handleScoringToggle}
              />
              <Label htmlFor="scoring-mode">Enable Scoring</Label>
            </div>
          </div>
          
          {scoringEnabled && (
            <div className="bg-blue-50 p-4 rounded-md space-y-4">
              <div className="flex items-center gap-4">
                <Label>Scoring Type:</Label>
                <div className="flex gap-2">
                  <Toggle
                    pressed={scoringType === "points"}
                    onPressedChange={() => handleScoringTypeChange("points")}
                    className={`flex items-center gap-1 px-3 py-1 ${
                      scoringType === "points" ? "bg-purple-100 text-purple-800" : ""
                    }`}
                    aria-label="Points scoring"
                  >
                    <Trophy size={16} />
                    Points
                  </Toggle>
                  
                  <Toggle
                    pressed={scoringType === "badges"}
                    onPressedChange={() => handleScoringTypeChange("badges")}
                    className={`flex items-center gap-1 px-3 py-1 ${
                      scoringType === "badges" ? "bg-purple-100 text-purple-800" : ""
                    }`}
                    aria-label="Badges scoring"
                  >
                    <BadgeCheck size={16} />
                    Badges
                  </Toggle>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md border">
                <p className="font-medium mb-2">Preview:</p>
                
                {teamModeEnabled ? (
                  <div className="space-y-2">
                    {teams.map((team, index) => (
                      <div key={team.id} className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.emoji}
                        </div>
                        <span className="text-sm">{team.name}</span>
                        <div className="ml-auto">
                          {scoringType === "points" ? (
                            <Badge variant="outline" className="bg-purple-50">
                              {10 * (index + 1)} pts
                            </Badge>
                          ) : (
                            <div className="flex">
                              {Array(index + 1).fill(0).map((_, i) => (
                                <Badge key={i} className="bg-yellow-500 border-0 mr-1 px-1">🏆</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {["Alice", "Bob", "Charlie"].map((student, index) => (
                      <div key={student} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          {student.charAt(0)}
                        </div>
                        <span className="text-sm">{student}</span>
                        <div className="ml-auto">
                          {scoringType === "points" ? (
                            <Badge variant="outline" className="bg-purple-50">
                              {10 * (3 - index)} pts
                            </Badge>
                          ) : (
                            <div className="flex">
                              {Array(3 - index).fill(0).map((_, i) => (
                                <Badge key={i} className="bg-yellow-500 border-0 mr-1 px-1">🏆</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
