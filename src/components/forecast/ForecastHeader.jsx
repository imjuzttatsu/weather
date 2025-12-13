import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Navigation } from 'lucide-react';
import KebabMenu from '../KebabMenu';


// Helper để tính responsive dựa trên aspect ratio
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

export default function ForecastHeader({
  setPage,
  openDetail,
  openSettings,
  isMenuOpen,
  setIsMenuOpen,
  currentTheme,
  primaryText,
  location,
  currentLocation = null,
  gpsEnabled = false,
}) {
  const [iconSize, setIconSize] = useState(28);
  const [gpsIconSize, setGpsIconSize] = useState(14);
  const [headerPadding, setHeaderPadding] = useState(getResponsiveHeaderPadding);

  useEffect(() => {
    const updateIconSizes = () => {
      const width = window.innerWidth;
      setIconSize(Math.round(Math.min(width * 0.07, 28)));
      setGpsIconSize(Math.round(Math.min(width * 0.035, 14)));
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
      {/* Back button - absolute positioned, same top as KebabMenu (top-8 = 2rem) but on the left */}
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
          top: 'clamp(1.5rem, 4vh, 2.5rem)', // Same as KebabMenu top-8 (2rem)
          left: 'clamp(0.75rem, 3vw, 1.5rem)', // Same as KebabMenu right-5 equivalent
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

      {/* Location display - centered, same row as buttons */}
      {location && (
        <div 
          className="absolute flex items-center justify-center"
          style={{ 
            top: 'clamp(1.5rem, 4vh, 2.5rem)', // Same as buttons
            left: '50%',
            transform: 'translateX(-50%)',
            gap: 'clamp(0.25rem, 1vw, 0.5rem)',
            zIndex: 50,
            pointerEvents: 'none', // Allow clicks to pass through to buttons behind
          }}
        >
          <MapPin size={iconSize} style={{ color: primaryText }} strokeWidth={2.5} />
          <span style={{
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 700,
            color: primaryText,
            fontSize: 'clamp(1.1rem, 3.5vw, 1.85rem)',
            letterSpacing: '0.3px',
            lineHeight: 1,
          }}>
            {currentLocation?.city || currentLocation?.detailedAddress || location}
          </span>
          {gpsEnabled && (
            <div
              className="flex items-center gap-1"
              style={{
                background: currentTheme.cardBgLight || 'rgba(21, 101, 192, 0.15)',
                padding: 'clamp(0.125rem, 1vw, 0.25rem) clamp(0.375rem, 1.5vw, 0.5rem)',
                borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                marginLeft: 'clamp(0.25rem, 1.5vw, 0.5rem)',
                gap: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                border: `1px solid ${currentTheme.border || 'rgba(255, 255, 255, 0.1)'}`,
              }}
              title="GPS đang bật"
            >
              <Navigation size={gpsIconSize} style={{ color: primaryText }} strokeWidth={2.5} />
              <span style={{
                fontSize: 'clamp(0.65rem, 2vw, 0.7rem)',
                color: primaryText,
                fontWeight: 600,
              }}>
                GPS
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
