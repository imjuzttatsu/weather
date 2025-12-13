import React, { useState, useEffect } from 'react';
import IconWeather from '../UI/IconWeather';


export default function MapPreviewCard({
  previewData,
  handlePreviewCardClick,
  currentTheme = {},
  primaryText = '#FFFFFF',
}) {
  const [iconSize, setIconSize] = useState(60);

  useEffect(() => {
    const updateIconSize = () => {
      const width = window.innerWidth;
      setIconSize(Math.round(Math.min(width * 0.15, 60)));
    };
    
    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, []);

  if (!previewData || !previewData.weather) return null;

  // Xác định day/night dựa trên giờ hiện tại
  const now = new Date();
  const currentHour = now.getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18;
  
  // Determine if dark mode
  const isDarkMode = currentTheme.heroGradient && currentTheme.heroGradient.includes('#1a1a2e');

  // Light mode gradient
  const lightMeshGradient = `
    radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.85) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.75) 0%, transparent 70%),
    linear-gradient(180deg, rgba(135, 206, 235, 0.88) 0%, rgba(30, 144, 255, 0.9) 100%)
  `;
  
  // Dark mode gradient
  const darkMeshGradient = currentTheme.heroGradient || `
    linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
  `;
  
  const meshGradient = isDarkMode ? darkMeshGradient : lightMeshGradient;
  
  // Light mode shadow
  const lightColoredShadow = `
    0px 20px 60px rgba(25, 118, 210, 0.4),
    0px 8px 25px rgba(25, 118, 210, 0.3),
    0px 0px 80px rgba(25, 118, 210, 0.25)
  `;
  
  // Dark mode shadow
  const darkColoredShadow = `
    0px 20px 60px rgba(100, 181, 246, 0.3),
    0px 8px 25px rgba(100, 181, 246, 0.25),
    0px 0px 80px rgba(100, 181, 246, 0.2)
  `;
  
  const coloredShadow = isDarkMode ? darkColoredShadow : lightColoredShadow;
  
  const previewCardStyle = {
    background: meshGradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      ${coloredShadow},
      ${isDarkMode ? `
        inset 3px 3px 8px rgba(255, 255, 255, 0.15),
        inset -3px -3px 8px rgba(100, 181, 246, 0.2),
        inset 6px 6px 12px rgba(255, 255, 255, 0.1),
        inset -6px -6px 12px rgba(100, 181, 246, 0.15)
      ` : `
        inset 3px 3px 8px rgba(255, 255, 255, 0.4),
        inset -3px -3px 8px rgba(30, 144, 255, 0.3),
        inset 6px 6px 12px rgba(255, 255, 255, 0.2),
        inset -6px -6px 12px rgba(30, 144, 255, 0.25)
      `}
    `,
    border: isDarkMode ? `1px solid ${currentTheme.border || 'rgba(255, 255, 255, 0.15)'}` : 'none',
  };

  return (
    <div
      className="rounded-3xl cursor-pointer transition-all active:scale-95 hover:opacity-90"
      style={{
        ...previewCardStyle,
        bottom: 'clamp(5rem, 15vh, 8rem)',
        left: 'clamp(0.75rem, 3vw, 1rem)',
        right: 'clamp(0.75rem, 3vw, 1rem)',
        padding: 'clamp(1rem, 4vw, 1.25rem)',
        zIndex: 10000,
        pointerEvents: 'auto',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        width: 'calc(100% - clamp(1.5rem, 6vw, 2rem))',
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[MapPreviewCard] MouseDown!');
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[MapPreviewCard] TouchStart!');
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[MapPreviewCard] Clicked!');
        if (handlePreviewCardClick) {
          console.log('[MapPreviewCard] Calling handlePreviewCardClick');
          handlePreviewCardClick();
        } else {
          console.warn('[MapPreviewCard] handlePreviewCardClick is not defined');
        }
        return false;
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[MapPreviewCard] TouchEnd!');
        if (handlePreviewCardClick) {
          console.log('[MapPreviewCard] Calling handlePreviewCardClick from TouchEnd');
          handlePreviewCardClick();
        }
        return false;
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1" style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
          <div style={{ 
            width: 'clamp(48px, 12vw, 60px)', 
            height: 'clamp(48px, 12vw, 60px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: 1
          }}>
            <IconWeather
              code={previewData.weather.weatherCode}
              size={iconSize}
              motionEnabled={false}
              isDay={isDayTime}
            />
          </div>
          <div className="flex-1">
            <div className="font-bold mb-1" style={{ color: '#FFFFFF', fontSize: 'clamp(0.8rem, 3vw, 0.875rem)' }}>
              {previewData.location.city}
            </div>
            <div className="mb-1" style={{ color: '#FFFFFF', opacity: 0.9, fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)' }}>
              {previewData.weather.condition}
            </div>
            <div className="font-bold" style={{ color: '#FFFFFF', fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }}>
              {Math.round(previewData.weather.temperature)}°
            </div>
          </div>
        </div>
        <div className="font-medium" style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)' }}>
          Nhấn để xem chi tiết →
        </div>
      </div>
    </div>
  );
}
