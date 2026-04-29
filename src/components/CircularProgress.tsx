import { TimerMode, MODE_CONFIG, CustomDurations } from './TimerTypes';

interface CircularProgressProps {
  mode: TimerMode;
  secondsLeft: number;
  customDurations: CustomDurations;
  isRunning: boolean;
  formatTime: (secs: number) => string;
}

export default function CircularProgress({ 
  mode, 
  secondsLeft, 
  customDurations, 
  isRunning,
  formatTime 
}: CircularProgressProps) {
  const currentMode = MODE_CONFIG[mode];
  const totalSeconds = customDurations[mode] * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const pulseClass = isRunning ? 'animate-pulse' : '';

  return (
    <div className="relative mb-8 w-full max-w-[300px] mx-auto">
      <svg 
        viewBox="0 0 300 300" 
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background circle */}
        <circle
          cx={150}
          cy={150}
          r={radius}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={8}
        />
        {/* Progress circle */}
        <circle
          cx={150}
          cy={150}
          r={radius}
          fill="none"
          stroke={mode === 'pomodoro' ? '#00f0ff' : mode === 'shortBreak' ? '#aaff00' : '#ff00ff'}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className={`text-6xl md:text-9xl font-mono font-bold ${currentMode.textClass} ${pulseClass}`}
          style={currentMode.shadowStyle}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  );
}
