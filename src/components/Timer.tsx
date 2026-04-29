'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface ModeConfig {
  label: string;
  minutes: number;
  color: string;
  textClass: string;
  borderClass: string;
  bgHoverClass: string;
  shadowStyle: React.CSSProperties;
}

const MODE_CONFIG: Record<TimerMode, ModeConfig> = {
  pomodoro: {
    label: 'Pomodoro',
    minutes: 25,
    color: 'neon-cyan',
    textClass: 'text-neon-cyan',
    borderClass: 'border-neon-cyan',
    bgHoverClass: 'hover:bg-neon-cyan/10',
    shadowStyle: { textShadow: '0 0 10px rgba(0,240,255,0.7), 0 0 20px rgba(0,240,255,0.4)' },
  },
  shortBreak: {
    label: 'Short Break',
    minutes: 5,
    color: 'neon-lime',
    textClass: 'text-neon-lime',
    borderClass: 'border-neon-lime',
    bgHoverClass: 'hover:bg-neon-lime/10',
    shadowStyle: { textShadow: '0 0 10px rgba(170,255,0,0.7), 0 0 20px rgba(170,255,0,0.4)' },
  },
  longBreak: {
    label: 'Long Break',
    minutes: 15,
    color: 'neon-magenta',
    textClass: 'text-neon-magenta',
    borderClass: 'border-neon-magenta',
    bgHoverClass: 'hover:bg-neon-magenta/10',
    shadowStyle: { textShadow: '0 0 10px rgba(255,0,255,0.7), 0 0 20px rgba(255,0,255,0.4)' },
  },
} as const;

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(MODE_CONFIG[mode].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [customDurations, setCustomDurations] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [todaySessions, setTodaySessions] = useState(0);
  const [weekSessions, setWeekSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationPermission = useRef<'granted' | 'denied' | 'default'>('default');

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        notificationPermission.current = perm;
      });
    } else if ('Notification' in window) {
      notificationPermission.current = Notification.permission;
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-completed-sessions');
    if (saved) setCompletedSessions(parseInt(saved, 10) || 0);

    const savedDurations = localStorage.getItem('pomodoro-custom-durations');
    if (savedDurations) {
      setCustomDurations(JSON.parse(savedDurations));
    }

    // Load today's sessions
    const today = new Date().toDateString();
    const savedToday = localStorage.getItem(`pomodoro-today-${today}`);
    if (savedToday) setTodaySessions(parseInt(savedToday, 10) || 0);

    // Load week sessions
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const savedWeek = localStorage.getItem(`pomodoro-week-${weekStart.toDateString()}`);
    if (savedWeek) setWeekSessions(parseInt(savedWeek, 10) || 0);

    // Load streak
    const savedStreak = localStorage.getItem('pomodoro-streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10) || 0);
  }, []);

  // Save completed sessions
  useEffect(() => {
    localStorage.setItem('pomodoro-completed-sessions', completedSessions.toString());
  }, [completedSessions]);

  // Save custom durations
  useEffect(() => {
    localStorage.setItem('pomodoro-custom-durations', JSON.stringify(customDurations));
    // Update current timer if mode matches
    setSecondsLeft(customDurations[mode] * 60);
  }, [customDurations]);

  // Save today sessions
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`pomodoro-today-${today}`, todaySessions.toString());
  }, [todaySessions]);

  // Save week sessions
  useEffect(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    localStorage.setItem(`pomodoro-week-${weekStart.toDateString()}`, weekSessions.toString());
  }, [weekSessions]);

  // Save streak
  useEffect(() => {
    localStorage.setItem('pomodoro-streak', streak.toString());
  }, [streak]);

  // Handle timer tick
  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        handleTimerComplete();
        return 0;
      }
      return prev - 1;
    });
  }, []);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'pomodoro') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      setTodaySessions((prev) => prev + 1);
      setWeekSessions((prev) => prev + 1);
      
      // Update streak
      const lastDate = localStorage.getItem('pomodoro-last-date');
      const today = new Date().toDateString();
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
          setStreak((prev) => prev + 1);
        } else if (lastDate !== today) {
          setStreak(1);
        }
        localStorage.setItem('pomodoro-last-date', today);
      }

      // Auto-switch to break after pomodoro
      if (newCompleted % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      // Show notification
      if (notificationPermission.current === 'granted') {
        new Notification('Pomodoro Complete! 🎉', {
          body: `Great work! You've completed ${newCompleted} sessions.`,
          icon: '/favicon.ico',
        });
      }
    } else {
      // After break, switch back to pomodoro
      setMode('pomodoro');
      
      if (notificationPermission.current === 'granted') {
        new Notification('Break Over!', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico',
        });
      }
    }

    // Play sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play().catch(() => {
      // Fallback: try a different sound or just ignore
      console.log('Audio playback failed');
    });
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft, tick]);

  // Reset timer when mode changes
  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(customDurations[mode] * 60);
  }, [mode, customDurations]);

  // Update page title with timer
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const timeStr = formatTime(secondsLeft);
      document.title = `${timeStr} - Daily Focus Timer`;
    } else if (secondsLeft === 0) {
      document.title = '⏰ Complete! - Daily Focus Timer';
    } else {
      document.title = 'Daily Focus Timer';
    }
  }, [isRunning, secondsLeft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't trigger when typing
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleTimer();
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            resetTimer();
          }
          break;
        case '1':
          setMode('pomodoro');
          break;
        case '2':
          setMode('shortBreak');
          break;
        case '3':
          setMode('longBreak');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, mode]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(customDurations[mode] * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentMode = MODE_CONFIG[mode];
  const totalSeconds = customDurations[mode] * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8 neon-text-cyan">Daily Focus Timer</h1>
      
      {/* Mode Selector */}
      <div className="flex gap-4 mb-8">
        {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => {
          const config = MODE_CONFIG[m];
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                isActive
                  ? `${config.textClass} ${config.borderClass} bg-opacity-20 ${config.bgHoverClass}`
                  : 'text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
              style={isActive ? config.shadowStyle : undefined}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Timer Display with Circular Progress */}
      <div className="relative mb-8">
        <svg width={300} height={300} className="-rotate-90">
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
            className={`text-9xl font-mono font-bold ${currentMode.textClass}`}
            style={currentMode.shadowStyle}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <button onClick={toggleTimer} className="neon-button min-w-[120px]">
          {isRunning ? 'Pause ⏸' : 'Start ▶'}
        </button>
        <button onClick={resetTimer} className="neon-button min-w-[120px]">
          Reset ↺
        </button>
      </div>

      {/* Custom Duration Settings */}
      <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Custom Durations (minutes)</h3>
        <div className="flex gap-4">
          {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <div key={m} className="flex flex-col items-center">
              <label className="text-sm text-gray-400 mb-1">{MODE_CONFIG[m].label}</label>
              <input
                type="number"
                min={1}
                max={60}
                value={customDurations[m]}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setCustomDurations((prev) => ({ ...prev, [m]: val }));
                }}
                className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-center text-neon-cyan focus:border-neon-cyan focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="text-center text-gray-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50">
            <p className="text-sm text-gray-400">Today</p>
            <p className="text-2xl font-bold neon-text-lime">{todaySessions}</p>
          </div>
          <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50">
            <p className="text-sm text-gray-400">This Week</p>
            <p className="text-2xl font-bold neon-text-cyan">{weekSessions}</p>
          </div>
          <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-2xl font-bold neon-text-magenta">{completedSessions}</p>
          </div>
          <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50">
            <p className="text-sm text-gray-400">Streak</p>
            <p className="text-2xl font-bold text-yellow-400">{streak} 🔥</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">Saved locally in your browser</p>
        <p className="text-xs text-gray-600 mt-2">
          Shortcuts: Space (start/pause), R (reset), 1/2/3 (switch modes)
        </p>
      </div>
    </div>
  );
}
