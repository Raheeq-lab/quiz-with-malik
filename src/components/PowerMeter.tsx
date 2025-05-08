
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { GaugeCircle, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";

interface PowerMeterProps {
  power: number; // 0-100
  maxPower?: number; // Default is 100
  animate?: boolean;
  showIcon?: boolean;
}

const PowerMeter: React.FC<PowerMeterProps> = ({ 
  power, 
  maxPower = 100,
  animate = true,
  showIcon = true
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

  // Get power level icon
  const getPowerIcon = () => {
    if (powerPercentage >= 75) return <BatteryFull className="text-green-500" size={18} />;
    if (powerPercentage >= 40) return <BatteryMedium className="text-blue-500" size={18} />;
    return <BatteryLow className="text-red-500" size={18} />;
  };

  return (
    <div className="space-y-1 w-full relative">
      <div className="flex justify-between text-xs">
        <span className="font-semibold flex items-center gap-1">
          {showIcon && <GaugeCircle size={14} className="opacity-70" />}
          Power Level
        </span>
        <span className={`font-medium flex items-center gap-1 ${
          powerPercentage >= 50 ? 'text-green-600' : 'text-red-600'
        }`}>
          {showIcon && getPowerIcon()}
          {Math.round(power)}/{maxPower}
        </span>
      </div>
      <Progress 
        value={powerPercentage} 
        className="h-3 bg-gray-200 rounded-full"
        indicatorClassName={cn(
          "transition-all duration-500",
          animate ? "animate-pulse" : "",
          getColorClass()
        )}
      />
      {powerPercentage > 0 && (
        <div 
          className={`absolute bottom-0 left-0 h-3 transition-all duration-300 ${animate ? "animate-pulse" : ""}`}
          style={{ width: `${powerPercentage}%` }}
        >
          <div 
            className="absolute right-0 w-2 h-3 rounded-full bg-white opacity-70 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default PowerMeter;
