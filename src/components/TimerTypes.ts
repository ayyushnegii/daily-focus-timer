import React from 'react';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface ModeConfig {
  label: string;
  minutes: number;
  color: string;
  textClass: string;
  borderClass: string;
  bgHoverClass: string;
  shadowStyle: React.CSSProperties;
}

export const MODE_CONFIG: Record<TimerMode, ModeConfig> = {
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

export interface CustomDurations {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}
