import React from 'react';
import { MapPin } from 'lucide-react';
import { METRICS_COLORED_SHADOW } from '../../constants/styles';


export default function MapCurrentLocation({
  locationName,
  currentTheme,
  primaryText,
}) {
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  const lightMeshGradient = `
    radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.85) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.75) 0%, transparent 70%),
    linear-gradient(180deg, rgba(135, 206, 235, 0.88) 0%, rgba(30, 144, 255, 0.9) 100%)
  `;
  
  const darkMeshGradient = currentTheme.heroGradient || `
    linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
  `;
  
  const meshGradient = isDarkMode ? darkMeshGradient : lightMeshGradient;

  const glassStyle = {
    background: currentTheme.cardBgStrong || currentTheme.cardBg || 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.18)')}`,
    boxShadow: `
      ${METRICS_COLORED_SHADOW},
      ${isDarkMode ? `
        inset 3px 3px 6px rgba(255, 255, 255, 0.15),
        inset -3px -3px 6px rgba(100, 181, 246, 0.2),
        inset 5px 5px 10px rgba(255, 255, 255, 0.1),
        inset -5px -5px 10px rgba(100, 181, 246, 0.15)
      ` : `
        inset 3px 3px 6px rgba(255, 255, 255, 0.5),
        inset -3px -3px 6px rgba(30, 144, 255, 0.2),
        inset 5px 5px 10px rgba(255, 255, 255, 0.3),
        inset -5px -5px 10px rgba(30, 144, 255, 0.15)
      `}
    `,
  };

  return (
    <div
      className="flex-shrink-0 mx-4 mb-4 p-5 rounded-3xl"
      style={glassStyle}
    >
      <div className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: primaryText, opacity: 0.8 }}>
        Vị trí hiện tại
      </div>
      <div className="flex items-center gap-3">
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: meshGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.25)',
        }}>
          <MapPin size={20} color="#FFFFFF" />
        </div>
        <span className="text-sm font-semibold flex-1" style={{ color: primaryText }}>
          {locationName}
        </span>
      </div>
    </div>
  );
}
