'use client';

import { useState, useEffect, useRef } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_CONFIG = {
  pomodoro: { label: 'Pomodoro', minutes: 25, color: 'neon-cyan' },
  shortBreak: { label: 'Short Break', minutes: 5, color: 'neon-lime' },
  longBreak: { label: 'Long Break', minutes: 15, color: 'neon-magenta' },
} as const;

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(MODE_CONFIG[mode].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load completed sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-completed-sessions');
    if (saved) setCompletedSessions(parseInt(saved, 10) || 0);
  }, []);

  // Save completed sessions to localStorage when updated
  useEffect(() => {
    localStorage.setItem('pomodoro-completed-sessions', completedSessions.toString());
  }, [completedSessions]);

  // Handle timer tick
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false);
      if (mode === 'pomodoro') {
        setCompletedSessions((prev) => prev + 1);
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play().catch(() => {});
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft, mode]);

  // Reset timer when mode changes
  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(MODE_CONFIG[mode].minutes * 60);
  }, [mode]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(MODE_CONFIG[mode].minutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentMode = MODE_CONFIG[mode];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8 neon-text-cyan">Daily Focus Timer</h1>
      
      {/* Mode Selector */}
      <div className="flex gap-4 mb-8">
        {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === m
                ? `neon-button active text-${MODE_CONFIG[m].color} border-${MODE_CONFIG[m].color} shadow-[0_0_10px_rgba(${m === 'pomodoro' ? '0,240,255' : m === 'shortBreak' ? '170,255,0' : '255,0,255'},0.7)]`
                : 'text-gray-400 border-gray-600 hover:border-gray-400'
            }`}
          >
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className={`text-9xl font-mono font-bold mb-8 neon-text-${currentMode.color}`}>
        {formatTime(secondsLeft)}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <button onClick={toggleTimer} className="neon-button min-w-[120px]">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="neon-button min-w-[120px]">
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="text-center text-gray-300">
        <p className="text-xl">
          Completed Pomodoros: <span className="neon-text-lime font-bold">{completedSessions}</span>
        </p>
        <p className="text-sm mt-2 text-gray-500">Saved locally in your browser</p>
      </div>
    </div>
  );
}
