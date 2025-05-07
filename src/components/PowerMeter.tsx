
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PowerMeterProps {
  power: number; // 0-100
  maxPower?: number; // Default is 100
  animate?: boolean;
}

const PowerMeter: React.FC<PowerMeterProps> = ({ 
  power, 
  maxPower = 100,
  animate = true 
}) => {
  // Calculate percentage of power
  const powerPercentage = Math.min(100, Math.max(0, (power / maxPower) * 100));
  
  // Determine color based on power level
  const getColorClass = () => {
    if (powerPercentage >= 75) return "bg-green-500";
    if (powerPercentage >= 50) return "bg-blue-500";
    if (powerPercentage >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between text-xs">
        <span className="font-semibold">Power Level</span>
        <span className={`font-medium ${powerPercentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.round(power)}/{maxPower}
        </span>
      </div>
      <Progress 
        value={powerPercentage} 
        className="h-3 bg-gray-200"
        indicatorClassName={cn(
          "transition-all duration-500",
          animate ? "animate-pulse" : "",
          getColorClass()
        )}
      />
    </div>
  );
};

export default PowerMeter;
