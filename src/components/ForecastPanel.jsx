import React, { useState } from 'react';
import IconWeather from './IconWeather.jsx';
import { ChevronLeft } from 'lucide-react';
import KebabMenu from './KebabMenu';
import { MetricsCard, WeatherDescription, DailyForecastItem } from './weather';

export default function ForecastPanel({
  dailyForecast = [],
  convertTemp = (t) => t,
  motionEnabled = true,
  currentTheme = {},
  primaryText = '#000',
  secondaryText = '#666',
  setPage,
  openDetail,
  openSettings,
  isMenuOpen,
  setIsMenuOpen,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
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
  
  const metricsColoredShadow = '0px 8px 20px rgba(25, 118, 210, 0.3), 0px 3px 10px rgba(25, 118, 210, 0.25)';

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

  const whiteCardStyle = {
    position: 'absolute',
    top: '10.5%', // 30% của 35% = 10.5%
    left: '24px',
    right: '24px',
    bottom: '55%', // Giảm chiều dài thẻ trắng
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
    zIndex: 2,
    overflowY: 'auto',
    padding: '1.5rem',
  };

  const bottomCardStyle = {
    position: 'absolute',
    top: '42%', // Kéo lên để giảm chiều dài
    left: 0,
    right: 0,
    bottom: '1rem', // Giảm chiều dài thẻ dưới
    background: 'transparent',
    zIndex: 2,
    overflowY: 'auto',
    padding: '1rem 2rem',
  };

  const filteredForecast = dailyForecast.filter(day => day.day !== 'Hôm nay').slice(0, 7);
  
  const selectedDay = filteredForecast.length > 0 && selectedDayIndex < filteredForecast.length 
    ? filteredForecast[selectedDayIndex] 
    : null;

  return (
    <section className="flex flex-col h-full relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-center"
        style={{
          fontFamily: 'Open Sans, sans-serif',
          background: 'transparent',
          paddingTop: '2rem',
          paddingBottom: '1rem',
          zIndex: 40,
        }}
      >
        <KebabMenu
          setPage={setPage}
          openDetail={openDetail}
          openSettings={openSettings}
          currentTheme={currentTheme}
          primaryText="#FFFFFF"
          size={24}
          color="#FFFFFF"
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          minimal={true}
        />
      </div>

      <div 
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center"
        style={{ 
          paddingTop: '2rem',
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          pointerEvents: 'none',
        }}
      >
        <button
          onClick={() => setPage && setPage(0)}
          className="absolute left-6 transition-all active:scale-95 hover:opacity-80"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            outline: 'none',
            boxShadow: 'none',
            pointerEvents: 'auto',
            zIndex: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '2rem',
            marginTop: '1px',
          }}
          aria-label="Quay lại"
        >
          <ChevronLeft size={30} color="#FFFFFF" />
        </button>
        
        <h2 
          className="text-2xl font-bold tracking-tight text-center"
          style={{ color: '#FFFFFF' }}
        >
          Dự báo 7 ngày
        </h2>
      </div>

      <div style={blueCardStyle} />

      <div style={whiteCardStyle} className="scrollbar-hide">
        {selectedDay && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '50%',
                transform: 'translate(calc(-50% - 60px), calc(-50% + 5px))',
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
                size={200}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '50%',
                transform: 'translate(calc(-50% - 60px + 200px + 1rem - 60px - 10px), calc(-50% + 20px))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  color: '#000',
                  opacity: 0.6,
                  marginBottom: '30px',
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
                  gap: '0.5rem',
                  marginTop: '0px',
                  alignSelf: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: '64px',
                    fontWeight: 'bold',
                    color: '#1565c0',
                    lineHeight: '1',
                  }}
                >
                  {convertTemp(selectedDay.temp)}°
                </span>
                <span
                  style={{
                    fontSize: '38px',
                    fontWeight: 'bold',
                    color: '#1565c0',
                    lineHeight: '1',
                    marginLeft: '-29px',
                    marginTop: '40px',
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
                  fontSize: '16px',
                  color: '#64B5F6',
                  marginTop: '10px',
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
                bottom: '1.5rem',
                left: '1.5rem',
                right: '1.5rem',
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
                  background: 'transparent', // Trong suốt hoàn toàn vì đã nằm trong white card
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  boxShadow: 'none', // Không cần shadow vì đã nằm trong card có shadow
                }}
              />
            </div>
          </>
        )}
      </div>

      <div style={bottomCardStyle} className="scrollbar-hide">
        {filteredForecast.length === 0 ? (
          <div className="text-center py-8">
            <p style={{ color: secondaryText }}>Đang tải dữ liệu dự báo...</p>
          </div>
        ) : (
          <div className="space-y-1" style={{ paddingTop: '2rem' }}>
            {filteredForecast.map((day, i) => (
              <DailyForecastItem
                key={i}
                day={day.day}
                icon={day.icon}
                desc={day.desc}
                temp={day.temp}
                tempMin={day.tempMin}
                isSelected={i === selectedDayIndex}
                onClick={() => setSelectedDayIndex(i)}
                convertTemp={convertTemp}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
