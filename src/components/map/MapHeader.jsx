import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import KebabMenu from '../KebabMenu';


// Helper để tính responsive dựa trên aspect ratio - GIỐNG WeatherHeader và ForecastHeader
function getResponsiveHeaderPadding() {
  if (typeof window === 'undefined') return { top: 12, bottom: 8 };
  
  const aspectRatio = window.innerWidth / window.innerHeight;
  const isTallScreen = aspectRatio < 0.52; // 18.5:9, 19:9
  const isWideScreen = aspectRatio > 0.55; // 16:9
  
  if (isTallScreen) {
    // Màn hình dài: dùng vw thay vì vh
    return {
      top: Math.max(10, Math.min(32, window.innerWidth * 0.025)),
      bottom: Math.max(6, Math.min(16, window.innerWidth * 0.012)),
    };
  } else if (isWideScreen) {
    // Màn hình rộng: dùng vh
    return {
      top: Math.max(12, Math.min(32, window.innerHeight * 0.025)),
      bottom: Math.max(8, Math.min(16, window.innerHeight * 0.012)),
    };
  } else {
    // Cân bằng
    const avgTop = (window.innerWidth * 0.025 + window.innerHeight * 0.025) / 2;
    const avgBottom = (window.innerWidth * 0.012 + window.innerHeight * 0.012) / 2;
    return {
      top: Math.max(10, Math.min(32, avgTop)),
      bottom: Math.max(6, Math.min(16, avgBottom)),
    };
  }
}

export default function MapHeader({
  setPage,
  openDetail,
  openSettings,
  isMenuOpen,
  setIsMenuOpen,
  currentTheme,
  primaryText,
}) {
  const [iconSize, setIconSize] = useState(28);
  const [headerPadding, setHeaderPadding] = useState(getResponsiveHeaderPadding);

  useEffect(() => {
    const updateIconSizes = () => {
      const width = window.innerWidth;
      setIconSize(Math.round(Math.min(width * 0.07, 28)));
    };
    
    const updatePadding = () => setHeaderPadding(getResponsiveHeaderPadding());
    
    const handleResize = () => {
      updateIconSizes();
      updatePadding();
    };
    
    updateIconSizes();
    updatePadding();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full flex flex-col items-center justify-center"
      style={{
        fontFamily: 'Open Sans, sans-serif',
        background: 'transparent',
        paddingTop: `${headerPadding.top}px`,
        paddingBottom: `${headerPadding.bottom}px`,
        zIndex: 30,
      }}
    >
      {/* Back button - absolute positioned, same top as KebabMenu but on the left */}
      <button
        onClick={() => setPage && setPage(0)}
        className="absolute transition-all active:scale-95 hover:opacity-80"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          outline: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 'clamp(1.5rem, 4vh, 2.5rem)',
          left: 'clamp(0.75rem, 3vw, 1.5rem)',
          zIndex: 100,
        }}
        aria-label="Quay lại"
      >
        <ChevronLeft size={iconSize} color={primaryText} />
      </button>

      {/* Kebab menu - absolute positioned (same as WeatherHeader) */}
      <KebabMenu
        setPage={setPage}
        openDetail={openDetail}
        openSettings={openSettings}
        currentTheme={currentTheme}
        primaryText={primaryText}
        size={iconSize}
        color={primaryText}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        minimal={true}
      />

      {/* Title - centered, same row as buttons */}
      <h2 
        className="absolute font-bold tracking-tight text-center"
        style={{ 
          color: primaryText,
          fontFamily: 'Open Sans, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.1rem, 3.5vw, 1.85rem)', // Same as location in ForecastPanel
          letterSpacing: '0.3px',
          lineHeight: 1,
          top: 'clamp(1.5rem, 4vh, 2.5rem)', // Same as buttons
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          pointerEvents: 'none', // Allow clicks to pass through to buttons behind
        }}
      >
        Bản đồ
      </h2>
    </div>
  );
}
