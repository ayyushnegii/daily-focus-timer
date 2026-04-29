'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ModeSelector from './ModeSelector';
import CircularProgress from './CircularProgress';
import StatsPanel from './StatsPanel';
import SettingsPanel from './SettingsPanel';
import { TimerMode, CustomDurations } from './TimerTypes';

const TIMER_STATE_KEY = 'pomodoro-timer-state';

interface SavedTimerState {
  mode: TimerMode;
  secondsLeft: number;
  isRunning: boolean;
  savedAt: number;
}

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [customDurations, setCustomDurations] = useState<CustomDurations>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [todaySessions, setTodaySessions] = useState(0);
  const [weekSessions, setWeekSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [volume, setVolume] = useState(0.5);
  const [selectedSound, setSelectedSound] = useState('beep');
  const [isMuted, setIsMuted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationPermission = useRef<'granted' | 'denied' | 'default'>('default');
  const completionHandledRef = useRef(false);

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

  // Load all data from localStorage
  useEffect(() => {
    // Load timer state
    const savedTimer = localStorage.getItem(TIMER_STATE_KEY);
    if (savedTimer) {
      try {
        const state: SavedTimerState = JSON.parse(savedTimer);
        const { mode: savedMode, secondsLeft: savedSeconds, isRunning: savedRunning, savedAt } = state;
        
        if (savedMode && savedSeconds !== undefined) {
          let adjustedSeconds = savedSeconds;
          
          if (savedRunning && savedAt) {
            const elapsedSec = Math.floor((Date.now() - savedAt) / 1000);
            adjustedSeconds = Math.max(0, savedSeconds - elapsedSec);

            if (adjustedSeconds === 0) {
              setTimeout(() => {
                handleTimerComplete();
              }, 100);
            }
          }
          
          setMode(savedMode);
          setSecondsLeft(adjustedSeconds);
          setIsRunning(savedRunning && adjustedSeconds > 0);
        }
      } catch (e) {
        console.error('Failed to load timer state', e);
      }
    }

    // Load other data
    const saved = localStorage.getItem('pomodoro-completed-sessions');
    if (saved) setCompletedSessions(parseInt(saved, 10) || 0);

    const savedDurations = localStorage.getItem('pomodoro-custom-durations');
    if (savedDurations) {
      setCustomDurations(JSON.parse(savedDurations));
    }

    const today = new Date().toDateString();
    const savedToday = localStorage.getItem(`pomodoro-today-${today}`);
    if (savedToday) setTodaySessions(parseInt(savedToday, 10) || 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const savedWeek = localStorage.getItem(`pomodoro-week-${weekStart.toDateString()}`);
    if (savedWeek) setWeekSessions(parseInt(savedWeek, 10) || 0);

    // Load streak with proper date tracking
    const savedStreak = localStorage.getItem('pomodoro-streak');
    const savedStreakDate = localStorage.getItem('pomodoro-streak-date');
    if (savedStreak && savedStreakDate) {
      const lastDate = new Date(savedStreakDate);
      const todayDate = new Date();
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Same day, keep streak
        setStreak(parseInt(savedStreak, 10) || 0);
      } else if (diffDays === 1) {
        // Consecutive day, keep streak
        setStreak(parseInt(savedStreak, 10) || 0);
      } else {
        // Streak broken
        setStreak(0);
      }
    }

    const savedGoal = localStorage.getItem('pomodoro-daily-goal');
    if (savedGoal) setDailyGoal(parseInt(savedGoal, 10) || 8);

    const savedVolume = localStorage.getItem('pomodoro-volume');
    if (savedVolume) setVolume(parseFloat(savedVolume) || 0.5);
    
    const savedSound = localStorage.getItem('pomodoro-selected-sound');
    if (savedSound) setSelectedSound(savedSound);
    
    const savedMuted = localStorage.getItem('pomodoro-muted');
    if (savedMuted) setIsMuted(savedMuted === 'true');
  }, []);

  // Save timer state
  useEffect(() => {
    const state: SavedTimerState = {
      mode,
      secondsLeft,
      isRunning,
      savedAt: Date.now(),
    };
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
  }, [mode, secondsLeft, isRunning]);

  // Save other states
  useEffect(() => {
    localStorage.setItem('pomodoro-completed-sessions', completedSessions.toString());
  }, [completedSessions]);

  useEffect(() => {
    localStorage.setItem('pomodoro-custom-durations', JSON.stringify(customDurations));
  }, [customDurations]);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`pomodoro-today-${today}`, todaySessions.toString());
  }, [todaySessions]);

  useEffect(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    localStorage.setItem(`pomodoro-week-${weekStart.toDateString()}`, weekSessions.toString());
  }, [weekSessions]);

  useEffect(() => {
    localStorage.setItem('pomodoro-streak', streak.toString());
    localStorage.setItem('pomodoro-streak-date', new Date().toDateString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('pomodoro-daily-goal', dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('pomodoro-volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('pomodoro-selected-sound', selectedSound);
  }, [selectedSound]);

  useEffect(() => {
    localStorage.setItem('pomodoro-muted', isMuted.toString());
  }, [isMuted]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    if (mode === 'pomodoro') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      setTodaySessions((prev) => prev + 1);
      setWeekSessions((prev) => prev + 1);
      
      // Update streak properly
      const lastStreakDate = localStorage.getItem('pomodoro-streak-date');
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStreakDate === yesterday.toDateString()) {
        // Consecutive day
        setStreak((prev) => prev + 1);
      } else if (lastStreakDate !== today) {
        // New streak
        setStreak(1);
      }
      localStorage.setItem('pomodoro-streak-date', today);

      // Auto-switch to break
      if (newCompleted % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      if (notificationPermission.current === 'granted') {
        new Notification('Pomodoro Complete! 🎉', {
          body: `Great work! You've completed ${newCompleted} sessions.`,
          icon: '/favicon.ico',
        });
      }
    } else {
      setMode('pomodoro');
      
      if (notificationPermission.current === 'granted') {
        new Notification('Break Over!', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico',
        });
      }
    }

    if (!isMuted) {
      playSound();
    }

    setTimeout(() => {
      completionHandledRef.current = false;
    }, 1000);
  }, [mode, completedSessions, isMuted]);

  const playSound = () => {
    const soundUrls: Record<string, string> = {
      beep: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3',
      chime: 'https://assets.mixkit.co/sfx/preview/mixkit-morning-birds-chirping-2460.mp3',
      bell: 'https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3',
      aggressive: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-alarm-990.mp3',
    };

    const audio = new Audio(soundUrls[selectedSound] || soundUrls.beep);
    audio.volume = volume;
    audio.play().catch(() => {
      console.log('Audio playback failed');
    });
  };

  // Timer tick
  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        handleTimerComplete();
        return 0;
      }
      return prev - 1;
    });
  }, [handleTimerComplete]);

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
    completionHandledRef.current = false;
  }, [mode, customDurations]);

  // Update page title
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      
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
        case 's':
        case 'S':
          if (mode !== 'pomodoro') {
            setMode('pomodoro');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, mode]);

  // Save state before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const state: SavedTimerState = {
        mode,
        secondsLeft,
        isRunning,
        savedAt: Date.now(),
      };
      localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, secondsLeft, isRunning]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(customDurations[mode] * 60);
    completionHandledRef.current = false;
    localStorage.removeItem(TIMER_STATE_KEY);
  };

  const skipBreak = () => {
    if (mode !== 'pomodoro') {
      setMode('pomodoro');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8 neon-text-cyan">Daily Focus Timer</h1>
      
      <ModeSelector mode={mode} setMode={setMode} />

      <CircularProgress 
        mode={mode}
        secondsLeft={secondsLeft}
        customDurations={customDurations}
        isRunning={isRunning}
        formatTime={formatTime}
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <button onClick={toggleTimer} className="neon-button min-w-[120px]">
          {isRunning ? 'Pause ⏸' : 'Start ▶'}
        </button>
        <button onClick={resetTimer} className="neon-button min-w-[120px]">
          Reset ↺
        </button>
        {mode !== 'pomodoro' && (
          <button onClick={skipBreak} className="neon-button min-w-[120px]">
            Skip Break →
          </button>
        )}
      </div>

      <SettingsPanel
        customDurations={customDurations}
        setCustomDurations={setCustomDurations}
        dailyGoal={dailyGoal}
        setDailyGoal={setDailyGoal}
        volume={volume}
        setVolume={setVolume}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        todaySessions={todaySessions}
      />

      <StatsPanel 
        todaySessions={todaySessions}
        weekSessions={weekSessions}
        completedSessions={completedSessions}
        streak={streak}
      />

      <p className="text-xs text-gray-600 mt-4">
        Shortcuts: Space (start/pause), R (reset), 1/2/3 (switch modes), S (skip break)
      </p>
    </div>
  );
}
