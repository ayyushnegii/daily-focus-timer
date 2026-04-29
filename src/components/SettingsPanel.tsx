import { TimerMode, CustomDurations } from './TimerTypes';

interface SettingsPanelProps {
  customDurations: CustomDurations;
  setCustomDurations: (durations: CustomDurations) => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  todaySessions: number;
}

export default function SettingsPanel({
  customDurations,
  setCustomDurations,
  dailyGoal,
  setDailyGoal,
  volume,
  setVolume,
  selectedSound,
  setSelectedSound,
  isMuted,
  setIsMuted,
  todaySessions,
}: SettingsPanelProps) {
  return (
    <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50 w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-3 text-gray-300">Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Duration Settings */}
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Durations (minutes)</h4>
          <div className="flex gap-4">
            {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <div key={m} className="flex flex-col items-center">
                <label className="text-xs text-gray-400 mb-1">
                  {m === 'pomodoro' ? 'Pomodoro' : m === 'shortBreak' ? 'Short' : 'Long'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={customDurations[m]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setCustomDurations({ ...customDurations, [m]: val });
                  }}
                  className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-center text-neon-cyan focus:border-neon-cyan focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sound Settings */}
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Sound</h4>
          <div className="flex flex-col gap-2">
            <select
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-neon-cyan"
            >
              <option value="beep">Digital Beep</option>
              <option value="chime">Morning Chime</option>
              <option value="bell">Classic Bell</option>
              <option value="aggressive">Sci-Fi Alarm</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-neon-cyan hover:text-neon-lime"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="md:col-span-2">
          <h4 className="text-sm text-gray-400 mb-2">Daily Goal (sessions)</h4>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={20}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-center text-neon-lime focus:border-neon-lime focus:outline-none"
            />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress: {todaySessions}/{dailyGoal}</span>
                <span>{Math.min(100, Math.round((todaySessions / dailyGoal) * 100))}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-700">
                <div 
                  className="bg-neon-lime h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todaySessions / dailyGoal) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
