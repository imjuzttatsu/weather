import React from 'react';
import { X, Droplet } from 'lucide-react';

export default function DetailedForecastPanel({
  isOpen,
  onClose,
  weather,
  details,
  currentTheme,
  primaryText,
  secondaryText,
  convertTemp,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-10 bg-black/40 backdrop-blur-sm">
      <div
        className="relative w-[90%] max-w-md rounded-3xl p-6"
        style={{
          background: currentTheme.cardBg,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1">
          <X color={primaryText} />
        </button>

        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="uppercase text-xs tracking-widest" style={{ color: secondaryText }}>
            {details.date}
          </span>
          <div className="text-7xl font-bold" style={{ color: primaryText }}>
            {convertTemp(weather.temp)}°
          </div>
          <span className="text-base font-medium" style={{ color: secondaryText }}>
            {weather.condition.toUpperCase()}
          </span>
          <span className="text-sm font-semibold" style={{ color: primaryText }}>
            Dự báo mưa
          </span>
        </div>

        <div className="mt-6 flex justify-center">
          <Droplet size={100} color={currentTheme.accent} />
        </div>

        <div className="mt-6 relative">
          {(() => {
            if (details.rainChances.length === 1) {
              const p = details.rainChances[0];
              const y = 100 - p.chance;
              return (
                <svg viewBox="0 0 100 100" className="w-full h-32">
                  <polygon
                    points={`0,100 50,${y} 100,100`}
                    fill={currentTheme.accent}
                    opacity="0.2"
                  />
                  <line
                    x1="0" y1={y} x2="100" y2={y}
                    stroke={currentTheme.accent}
                    strokeWidth="2"
                  />
                </svg>
              );
            }
            
            const n = details.rainChances.length;
            const points = details.rainChances
              .map((p, i) => `${(i / (n - 1)) * 100},${100 - p.chance}`)
              .join(' ');
              
            return (
              <svg viewBox="0 0 100 100" className="w-full h-32">
                <polygon
                  points={`0,100 ${points} 100,100`}
                  fill={currentTheme.accent}
                  opacity="0.2"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={currentTheme.accent}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            );
          })()}
          
          <div className="absolute inset-0 pointer-events-none">
            {details.rainChances.map((p, i) => (
              <React.Fragment key={i}>
                <span
                  className="absolute text-xs"
                  style={{
                    color: primaryText,
                    top: 0,
                    left:
                      details.rainChances.length === 1
                        ? '50%'
                        : `${(i / (details.rainChances.length - 1)) * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {p.chance}%
                </span>
                <span
                  className="absolute text-xs"
                  style={{
                    color: secondaryText,
                    bottom: 0,
                    left:
                      details.rainChances.length === 1
                        ? '50%'
                        : `${(i / (details.rainChances.length - 1)) * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {p.time}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {details.metrics.map((m, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span style={{ color: primaryText }}>{m.label}</span>
              <span style={{ color: secondaryText, fontWeight: 600 }}>{m.value}</span>
            </div> 
          ))}
        </div>
      </div>
    </div>
  );
}