import React from 'react';
import { Droplets, Droplet, Wind } from 'lucide-react';

export default function MetricsCard({ 
  rainChance, 
  humidity, 
  windSpeed, 
  accentColor = '#1565c0', 
  primaryText = '#000', 
  secondaryText = '#666',
  style = {}
}) {
  const defaultStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      0px 8px 20px rgba(25, 118, 210, 0.3),
      0px 3px 10px rgba(25, 118, 210, 0.25),
      inset 3px 3px 6px rgba(255, 255, 255, 0.5),
      inset -3px -3px 6px rgba(30, 144, 255, 0.2),
      inset 5px 5px 10px rgba(255, 255, 255, 0.3),
      inset -5px -5px 10px rgba(30, 144, 255, 0.15)
    `,
    borderRadius: '2rem',
    border: 'none',
    ...style
  };

  return (
    <div className="p-5" style={defaultStyle}>
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col items-center flex-1">
          <Droplets size={24} color={accentColor} strokeWidth={1.5} />
          <div className="text-lg font-bold mt-2" style={{ color: primaryText }}>
            {rainChance || 0}%
          </div>
          <div className="text-sm mt-1" style={{ color: secondaryText }}>
            Khả năng mưa
          </div>
        </div>
        
        <div className="flex flex-col items-center flex-1">
          <Droplet size={24} color={accentColor} strokeWidth={1.5} />
          <div className="text-lg font-bold mt-2" style={{ color: primaryText }}>
            {humidity || 0}%
          </div>
          <div className="text-sm mt-1" style={{ color: secondaryText }}>
            Độ ẩm
          </div>
        </div>
        
        <div className="flex flex-col items-center flex-1">
          <Wind size={24} color={accentColor} strokeWidth={1.5} />
          <div className="text-lg font-bold mt-2" style={{ color: primaryText }}>
            {windSpeed || 0} km/h
          </div>
          <div className="text-sm mt-1" style={{ color: secondaryText }}>
            Tốc độ gió
          </div>
        </div>
      </div>
    </div>
  );
}

