import React, { useState, useEffect } from 'react';
import IconWeather from './IconWeather.jsx';
import { MapPin, ChevronLeft } from 'lucide-react';
import KebabMenu from './KebabMenu';
import { MetricsCard, WeatherDescription, HourlyCard } from './weather';

export default function WeatherPanel({
  currentWeather,
  location,
  hourlyForecast = [],
  dailyForecast = [],
  convertTemp = (t) => t,
  motionEnabled = true,
  currentTheme = {},
  primaryText = '#000',
  secondaryText = '#666',
  onOpenDrawer = () => {},
  setPage,
  openDetail,
  openSettings,
  isMenuOpen,
  setIsMenuOpen,
  isPreview = false,
}) {
  if (!currentWeather || !location) {
    return null;
  }

  const [selectedHour, setSelectedHour] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const meshGradient = `
    radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.85) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.75) 0%, transparent 70%),
    linear-gradient(180deg, rgba(135, 206, 235, 0.88) 0%, rgba(30, 144, 255, 0.9) 100%)
  `;
  
  const lightMeshGradient = `
    radial-gradient(circle at 20% 30%, rgba(176, 224, 230, 0.7) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(135, 206, 235, 0.65) 0%, transparent 50%),
    linear-gradient(180deg, rgba(176, 224, 230, 0.75) 0%, rgba(135, 206, 235, 0.8) 100%)
  `;
  
  const footerMeshGradient = `
    radial-gradient(circle at 20% 50%, rgba(30, 144, 255, 0.88) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(135, 206, 235, 0.85) 0%, transparent 50%),
    linear-gradient(90deg, rgba(30, 144, 255, 0.88) 0%, rgba(70, 130, 180, 0.82) 50%, rgba(135, 206, 235, 0.88) 100%)
  `;

  const coloredShadow = `
    0px 20px 60px rgba(25, 118, 210, 0.4),
    0px 8px 25px rgba(25, 118, 210, 0.3),
    0px 0px 80px rgba(25, 118, 210, 0.25)
  `;
  
  const heroColoredShadow = `
    0px 25px 70px rgba(25, 118, 210, 0.45),
    0px 10px 30px rgba(25, 118, 210, 0.35),
    0px 0px 100px rgba(25, 118, 210, 0.3),
    0px 5px 15px rgba(25, 118, 210, 0.25)
  `;
  
  const activeHourlyColoredShadow = '0px 8px 20px rgba(25, 118, 210, 0.4), 0px 3px 10px rgba(25, 118, 210, 0.3)';
  const lightHourlyColoredShadow = '0px 6px 18px rgba(100, 181, 246, 0.25), 0px 2px 8px rgba(100, 181, 246, 0.2)';
  const newAccentColor = '#64B5F6';
  const metricsColoredShadow = '0px 8px 20px rgba(25, 118, 210, 0.3), 0px 3px 10px rgba(25, 118, 210, 0.25)';

  const heroCardStyle = {
    background: meshGradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      ${heroColoredShadow},
      inset 3px 3px 8px rgba(255, 255, 255, 0.4),
      inset -3px -3px 8px rgba(30, 144, 255, 0.3),
      inset 6px 6px 12px rgba(255, 255, 255, 0.2),
      inset -6px -6px 12px rgba(30, 144, 255, 0.25)
    `,
    borderRadius: '2rem',
    marginLeft: '50px',
    marginRight: '50px',
    aspectRatio: '630 / 514',
    position: 'relative',
    paddingTop: '0px',
    paddingLeft: '2.5rem',
    border: 'none',
  };
  
  const otherSectionStyle = {
    marginLeft: '15px',
    marginRight: '15px',
  };
  
  const metricsCardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      ${metricsColoredShadow},
      inset 3px 3px 6px rgba(255, 255, 255, 0.5),
      inset -3px -3px 6px rgba(30, 144, 255, 0.2),
      inset 5px 5px 10px rgba(255, 255, 255, 0.3),
      inset -5px -5px 10px rgba(30, 144, 255, 0.15)
    `,
    borderRadius: '2rem',
    border: 'none',
  };
  
  const hourlyActiveStyle = {
    background: `
      radial-gradient(circle at 30% 30%, rgba(135, 206, 235, 0.9) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(30, 144, 255, 0.9) 0%, transparent 50%),
      linear-gradient(180deg, rgba(70, 130, 180, 0.85) 0%, rgba(30, 144, 255, 0.9) 100%)
    `,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    color: '#FFFFFF',
    boxShadow: `
      ${activeHourlyColoredShadow},
      inset 2px 2px 6px rgba(255, 255, 255, 0.35),
      inset -2px -2px 6px rgba(30, 144, 255, 0.3),
      inset 4px 4px 8px rgba(255, 255, 255, 0.25),
      inset -4px -4px 8px rgba(30, 144, 255, 0.25)
    `,
    borderRadius: '1.5rem',
    minHeight: 0,
    minWidth: 0,
    border: 'none',
  };
  
  const hourlyInactiveStyle = {
    background: `
      radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.65) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(100, 181, 246, 0.6) 0%, transparent 50%),
      linear-gradient(180deg, rgba(135, 206, 235, 0.7) 0%, rgba(100, 181, 246, 0.75) 100%)
    `,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    boxShadow: `
      ${lightHourlyColoredShadow},
      inset 2px 2px 5px rgba(255, 255, 255, 0.3),
      inset -2px -2px 5px rgba(100, 181, 246, 0.2),
      inset 4px 4px 8px rgba(255, 255, 255, 0.2),
      inset -4px -4px 8px rgba(100, 181, 246, 0.15)
    `,
    borderRadius: '1.5rem',
    minHeight: 0,
    minWidth: 0,
    border: 'none',
    color: '#FFFFFF',
  };
  
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = currentDateTime.toLocaleDateString('vi-VN', dateOptions);
  const time = currentDateTime.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });


  return (
    <section
      className="flex flex-col h-full relative scrollbar-hide"
      style={{
        background: 'transparent',
        fontFamily: 'Open Sans, sans-serif',
        paddingTop: '100px',
        paddingBottom: '40px',
        overflowX: 'visible',
        overflowY: 'auto',
        marginLeft: '-20px',
        marginRight: '-20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      
      {isPreview && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (setPage) {
              if (import.meta.env.DEV) {
                console.log('Quay lại MapPanel');
              }
              setPage(2); // Quay về MapPanel
            }
          }}
          className="absolute left-6 transition-all active:scale-95 hover:opacity-80"
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.5rem',
            margin: 0,
            outline: 'none',
            boxShadow: 'none',
            pointerEvents: 'auto',
            zIndex: 100,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '2rem',
            marginTop: '1px',
          }}
          aria-label="Quay lại"
        >
          <ChevronLeft size={30} color="#1565c0" />
        </button>
      )}

      <div
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-center"
        style={{
          fontFamily: 'Open Sans, sans-serif',
          background: 'transparent',
          paddingTop: '2rem',
          paddingBottom: '1rem',
          zIndex: 30,
        }}
      >
        {!isPreview && (
          <KebabMenu
            setPage={setPage}
            openDetail={openDetail}
            openSettings={openSettings}
            currentTheme={currentTheme}
            primaryText={primaryText}
            size={24}
            color="#1565c0"
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}

        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin size={28} style={{ color: '#1565c0' }} strokeWidth={2.5} />
          <span style={{
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 700,
            color: '#1565c0',
            fontSize: '1.85rem',
            letterSpacing: '0.3px',
            lineHeight: 1,
          }}>
            {location}
          </span>
        </div>
        
        <p style={{
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '0.95rem',
          fontWeight: 400,
          color: secondaryText,
          letterSpacing: '0.2px',
          textAlign: 'center',
        }}>
          {formattedDate} {time}
        </p>
      </div>
      
      <div>
        
        <div style={heroCardStyle} className="mt-4 mb-3">
          
          <div className="flex-shrink-0 relative flex items-center justify-center" style={{ width: '100%' }}>
            <div
              className="font-extrabold tracking-tighter leading-none absolute"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: 'clamp(6rem, 13vw, 11rem)',
                color: '#2A6CD9',
                opacity: 0.8,
                filter: 'blur(10px)',
                top: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {convertTemp(currentWeather.temp)}°
            </div>

            <div
              className="font-extrabold tracking-tighter leading-none relative"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: 'clamp(6rem, 13vw, 11rem)',
                color: '#FFFFFF',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                filter: 'drop-shadow(0px 6px 12px rgba(72, 87, 217, 0.5))',
              }}
            >
              {convertTemp(currentWeather.temp)}°
            </div>
          </div>
          
          <div
            className="absolute text-left"
            style={{
              bottom: '40px',
              left: '159px',
              opacity: 0.6,
            }}
          >
            <div className="text-2xl text-white/95 leading-7">
              <WeatherDescription 
                condition={currentWeather.condition}
                shouldBreakLine={true}
              />
            </div>
          </div>

          <div
            className="absolute"
            style={{
              bottom: '-35px',
              left: '-44px',
            }}
          >
            <IconWeather
              code={currentWeather.weatherCode || 0}
              size={200}
              motionEnabled={motionEnabled}
            />
          </div>
        </div>

        <div style={otherSectionStyle} className="mb-2">
          <MetricsCard
            rainChance={currentWeather.rainChance}
            humidity={currentWeather.humidity}
            windSpeed={currentWeather.windSpeed}
            accentColor={currentTheme.accent || newAccentColor}
            primaryText={primaryText}
            secondaryText={secondaryText}
            style={metricsCardStyle}
          />
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-3" style={otherSectionStyle}>
            <h3 className="text-base font-bold" style={{ color: primaryText }}>
              Hôm nay
            </h3>
            {!isPreview && (
              <button 
                className="text-sm font-medium transition-all active:scale-95 hover:opacity-80" 
                style={{ color: secondaryText }}
                onClick={() => setPage && setPage(1)}
              >
                7 ngày tới →
              </button>
            )}
          </div>
          
          <div className="relative" style={{ margin: '0 -20px' }}>
            <div
              className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to right, #E3F2FD, transparent)',
                left: '20px',
              }}
            />
            
            <div
              className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to left, #E3F2FD, transparent)',
                right: '20px',
              }}
            />
            
            <div className="flex overflow-x-auto scrollbar-hide gap-3" style={{ paddingTop: '8px', paddingBottom: '8px', paddingLeft: '15px', paddingRight: '15px' }}>
              {hourlyForecast.map((d, i) => (
                <HourlyCard
                  key={i}
                  time={i === 0 ? 'Now' : d.time}
                  temp={d.temp}
                  icon={d.icon}
                  isActive={i === selectedHour}
                  isPreview={isPreview}
                  onClick={() => setSelectedHour(i)}
                  convertTemp={convertTemp}
                  activeStyle={hourlyActiveStyle}
                  inactiveStyle={hourlyInactiveStyle}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={otherSectionStyle} className="mb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold" style={{ color: primaryText }}>
              Thành phố khác
            </h3>
            {!isPreview && (
              <button
                className="text-2xl font-bold transition-all active:scale-95"
                style={{ color: '#1565c0' }}
                aria-label="Add city"
                onClick={() => setPage && setPage(2)}
              >
                +
              </button>
            )}
          </div>
        </div>

        <div style={otherSectionStyle} className="mb-0">
          <div
            className="p-6"
            style={{
              background: footerMeshGradient,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: `
                ${coloredShadow},
                inset 3px 3px 8px rgba(255, 255, 255, 0.4),
                inset -3px -3px 8px rgba(30, 144, 255, 0.3),
                inset 6px 6px 12px rgba(255, 255, 255, 0.2),
                inset -6px -6px 12px rgba(30, 144, 255, 0.25)
              `,
              borderRadius: '2rem',
              border: 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <IconWeather 
                  code={currentWeather.weatherCode || 1} 
                  size={48}
                  motionEnabled={false}
                />
                <span className="text-xl font-bold text-white">
                  {location}
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {convertTemp(currentWeather.temp)}°
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}