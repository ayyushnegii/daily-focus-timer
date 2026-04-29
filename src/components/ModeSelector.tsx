import { TimerMode, MODE_CONFIG } from './TimerTypes';

interface ModeSelectorProps {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
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
  );
}
