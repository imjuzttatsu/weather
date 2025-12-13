import React, { useState, useEffect } from 'react';
import IconWeather from '../UI/IconWeather';
import { MetricsCard, WeatherDescription } from '../weather';
import { METRICS_COLORED_SHADOW } from '../../constants/styles';

// Helper để tính responsive margins dựa trên aspect ratio - GIỐNG THẺ HERO
function getResponsiveForecastMargins() {
  if (typeof window === 'undefined') return { left: 12, right: 12 };
  
  const aspectRatio = window.innerWidth / window.innerHeight;
  const isTallScreen = aspectRatio < 0.52; // 18.5:9, 19:9
  const isWideScreen = aspectRatio > 0.55; // 16:9
  
  if (isTallScreen) {
    // Màn hình dài: margins nhỏ hơn - GIẢM thêm 2% để rộng thêm sang 2 bên (từ 95% xuống 93%)
    return {
      left: Math.max(10, Math.min(38, window.innerWidth * 0.032 * 0.93)),
      right: Math.max(10, Math.min(38, window.innerWidth * 0.032 * 0.93)),
    };
  } else if (isWideScreen) {
    // Màn hình rộng: margins lớn hơn - GIẢM thêm 2% để rộng thêm sang 2 bên (từ 95% xuống 93%)
    return {
      left: Math.max(13, Math.min(48, window.innerWidth * 0.04 * 0.93)),
      right: Math.max(13, Math.min(48, window.innerWidth * 0.04 * 0.93)),
    };
  } else {
    // Cân bằng - GIẢM thêm 2% để rộng thêm sang 2 bên (từ 95% xuống 93%)
    const margin = window.innerWidth * 0.035 * 0.93;
    return {
      left: Math.max(10, Math.min(48, margin)),
      right: Math.max(10, Math.min(48, margin)),
    };
  }
}

export default function ForecastDetailCard({
  selectedDay,
  convertTemp,
  primaryText,
  secondaryText,
}) {
  const blueCardMeshGradient = `
    radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.85) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.75) 0%, transparent 70%),
    linear-gradient(180deg, rgba(135, 206, 235, 0.88) 0%, rgba(30, 144, 255, 0.9) 100%)
  `;
  
  const blueCardColoredShadow = `
    0px 25px 70px rgba(25, 118, 210, 0.45),
    0px 10px 30px rgba(25, 118, 210, 0.35),
    0px 0px 100px rgba(25, 118, 210, 0.3),
    0px 5px 15px rgba(25, 118, 210, 0.25)
  `;

  const blueCardStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    background: blueCardMeshGradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      ${blueCardColoredShadow},
      inset 3px 3px 8px rgba(255, 255, 255, 0.4),
      inset -3px -3px 8px rgba(30, 144, 255, 0.3),
      inset 6px 6px 12px rgba(255, 255, 255, 0.2),
      inset -6px -6px 12px rgba(30, 144, 255, 0.25)
    `,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '2rem',
    borderBottomRightRadius: '2rem',
    border: 'none',
    zIndex: 1,
  };

  const [iconSize, setIconSize] = useState(200);
  const [forecastMargins, setForecastMargins] = useState(getResponsiveForecastMargins);

  useEffect(() => {
    const updateIconSize = () => {
      const width = window.innerWidth;
      setIconSize(Math.round(Math.min(width * 0.3, 200)));
    };
    
    const updateMargins = () => setForecastMargins(getResponsiveForecastMargins());
    
    const handleResize = () => {
      updateIconSize();
      updateMargins();
    };
    
    updateIconSize();
    updateMargins();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const whiteCardStyle = {
    position: 'absolute',
    top: '10.5%',
    left: `${forecastMargins.left}px`,
    right: `${forecastMargins.right}px`,
    bottom: '55%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      ${METRICS_COLORED_SHADOW},
      inset 3px 3px 6px rgba(255, 255, 255, 0.5),
      inset -3px -3px 6px rgba(30, 144, 255, 0.2),
      inset 5px 5px 10px rgba(255, 255, 255, 0.3),
      inset -5px -5px 10px rgba(30, 144, 255, 0.15)
    `,
    borderRadius: '2rem',
    border: 'none',
    zIndex: 2,
    overflowY: 'auto',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    transform: 'scale(1.05)', // Tăng 5% kích thước - GIỐNG THẺ HERO
  };

  if (!selectedDay) return null;

  return (
    <>
      <div style={blueCardStyle} />
      <div style={whiteCardStyle} className="scrollbar-hide">
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: `translate(calc(-50% - clamp(40px, 10vw, 60px)), calc(-50% + 5px))`,
            width: '50%',
            height: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconWeather
            code={selectedDay.icon}
            motionEnabled={false}
            size={iconSize}
            isDay={true}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: `translate(calc(-50% + clamp(80px, 22vw, 120px)), calc(-50% + clamp(15px, 3vh, 20px)))`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(0.875rem, 3.5vw, 1.125rem)',
              color: '#000',
              opacity: 0.6,
              marginBottom: 'clamp(15px, 4vh, 30px)',
              marginTop: '-5px',
              lineHeight: '1',
              transform: 'translateY(25px)',
              fontFamily: 'Open Sans, sans-serif',
              alignSelf: 'flex-start',
            }}
          >
            {selectedDay.day || 'Ngày mai'}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              marginTop: '0px',
              alignSelf: 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(2.5rem, 14vw, 4rem)',
                fontWeight: 'bold',
                color: '#1565c0',
                lineHeight: '1',
              }}
            >
              {convertTemp(selectedDay.temp)}°
            </span>
            <span
              style={{
                fontSize: 'clamp(1.5rem, 8vw, 2.375rem)',
                fontWeight: 'bold',
                color: '#1565c0',
                lineHeight: '1',
                marginLeft: 'clamp(-20px, -5vw, -29px)',
                marginTop: 'clamp(25px, 6vh, 40px)',
              }}
            >
              /{convertTemp(selectedDay.tempMin)}°
            </span>
          </div>
          <WeatherDescription
            condition={selectedDay.desc}
            showPressure={true}
            pressure={selectedDay.pressure}
            style={{
              fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
              color: '#64B5F6',
              marginTop: 'clamp(8px, 2vh, 10px)',
              lineHeight: '1.4',
              fontFamily: 'Open Sans, sans-serif',
              alignSelf: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          />
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(1rem, 3vw, 1.5rem)',
            left: 'clamp(1rem, 3vw, 1.5rem)',
            right: 'clamp(1rem, 3vw, 1.5rem)',
          }}
        >
          <MetricsCard
            rainChance={selectedDay.precipitationProbability}
            humidity={selectedDay.humidity}
            windSpeed={selectedDay.windSpeed}
            accentColor="#1565c0"
            primaryText={primaryText}
            secondaryText={secondaryText}
            style={{ 
              padding: 0, 
              background: 'transparent',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              boxShadow: 'none',
            }}
          />
        </div>
      </div>
    </>
  );
}
