interface StatsPanelProps {
  todaySessions: number;
  weekSessions: number;
  completedSessions: number;
  streak: number;
  todaySessionsLabel?: string;
}

export default function StatsPanel({ 
  todaySessions, 
  weekSessions, 
  completedSessions, 
  streak,
  todaySessionsLabel = "Today"
}: StatsPanelProps) {
  return (
    <div className="text-center text-gray-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-3 border border-gray-700 rounded-lg bg-gray-900/50">
          <p className="text-sm text-gray-400">{todaySessionsLabel}</p>
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
    </div>
  );
}
