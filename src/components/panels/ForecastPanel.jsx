import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ReactFrappeChart from 'react-frappe-charts';
import IconWeather from '../UI/IconWeather';
import ForecastHeader from '../forecast/ForecastHeader';
import ForecastList from '../forecast/ForecastList';

// Helper để tính responsive dựa trên aspect ratio - GIỐNG WeatherPanel
function getResponsivePadding() {
  if (typeof window === 'undefined') return { top: 50, bottom: 15, left: 8, right: 8 };
  
  const aspectRatio = window.innerWidth / window.innerHeight;
  const isTallScreen = aspectRatio < 0.52; // 18.5:9, 19:9
  const isWideScreen = aspectRatio > 0.55; // 16:9
  
  if (isTallScreen) {
    // Màn hình dài: giảm vh, dùng vw
    return {
      top: Math.max(45, Math.min(90, window.innerWidth * 0.08)),
      bottom: Math.max(12, Math.min(35, window.innerWidth * 0.03)),
      left: Math.max(8, Math.min(20, window.innerWidth * 0.02)),
      right: Math.max(8, Math.min(20, window.innerWidth * 0.02)),
    };
  } else if (isWideScreen) {
    // Màn hình rộng: dùng vh nhiều hơn
    return {
      top: Math.max(50, Math.min(100, window.innerHeight * 0.12)),
      bottom: Math.max(15, Math.min(40, window.innerHeight * 0.05)),
      left: Math.max(8, Math.min(20, window.innerWidth * 0.025)),
      right: Math.max(8, Math.min(20, window.innerWidth * 0.025)),
    };
  } else {
    // Cân bằng
    return {
      top: Math.max(50, Math.min(100, (window.innerWidth * 0.08 + window.innerHeight * 0.10) / 2)),
      bottom: Math.max(15, Math.min(40, (window.innerWidth * 0.03 + window.innerHeight * 0.04) / 2)),
      left: Math.max(8, Math.min(20, window.innerWidth * 0.025)),
      right: Math.max(8, Math.min(20, window.innerWidth * 0.025)),
    };
  }
}

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
  onShowDetail,
  location,
  currentLocation = null,
  gpsEnabled = false,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [highlightedDayIndex, setHighlightedDayIndex] = useState(null);
  const [responsivePadding, setResponsivePadding] = useState(getResponsivePadding);
  const chartRef = useRef(null);

  // Lấy 10 ngày
  const filteredForecast = dailyForecast.filter(day => day.day !== 'Hôm nay').slice(0, 10);
  
  // Chuẩn bị dữ liệu cho biểu đồ lượng mưa
  const rainChartData = React.useMemo(() => {
    const labels = filteredForecast.map(day => {
      // Dùng full tiếng Việt, không viết tắt
      return day.day;
    });
    
    const values = filteredForecast.map(day => 
      day.precipitationProbability || day.rainChance || 0
    );
    
    return {
      labels,
      datasets: [{ values }]
    };
  }, [filteredForecast]);

  // Update responsive padding khi resize - GIỐNG WeatherPanel
  useEffect(() => {
    const updatePadding = () => setResponsivePadding(getResponsivePadding());
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const dayIndex = filteredForecast.findIndex(d => d.day === selectedDay.day);
      if (dayIndex !== -1) {
        setHighlightedDayIndex(dayIndex);
      }
    }
  }, [selectedDay, filteredForecast]);

  const handleChartClick = (e) => {
    if (!chartRef.current || !selectedDay) return;

    const chartContainer = e.currentTarget;
    const rect = chartContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    // Tính toán index dựa trên vị trí click (cho line chart)
    const chartWidth = rect.width;
    const segmentWidth = chartWidth / (filteredForecast.length - 1 || 1);
    const clickedIndex = Math.round(clickX / segmentWidth);
    const clampedIndex = Math.max(0, Math.min(clickedIndex, filteredForecast.length - 1));

    if (clampedIndex >= 0 && clampedIndex < filteredForecast.length) {
      setHighlightedDayIndex(clampedIndex);
      setSelectedDay(filteredForecast[clampedIndex]);
      setSelectedDayIndex(clampedIndex);
    }
  };

  return (
    <section 
      className="flex flex-col relative scrollbar-hide"
      style={{
        background: 'transparent',
        fontFamily: 'Open Sans, sans-serif',
        paddingTop: `${responsivePadding.top}px`,
        paddingBottom: `${responsivePadding.bottom}px`,
        overflowX: 'hidden',
        overflowY: 'visible',
        position: 'relative',
        marginLeft: '0px',
        marginRight: '0px',
        paddingLeft: `${responsivePadding.left}px`,
        paddingRight: `${responsivePadding.right}px`,
        minHeight: '100%',
        touchAction: 'pan-y', // Cho phép scroll dọc nhưng vẫn có thể swipe ngang
      }}
    >
      <ForecastHeader
        setPage={setPage}
        openDetail={openDetail}
        openSettings={openSettings}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentTheme={currentTheme}
        primaryText={primaryText}
        location={location}
        currentLocation={currentLocation}
        gpsEnabled={gpsEnabled}
      />
      
      {/* ForecastList - Các thẻ dự báo ngày */}
      <ForecastList
        filteredForecast={filteredForecast}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={setSelectedDayIndex}
        onDayClick={(day) => {
          setSelectedDay(day);
          const dayIndex = filteredForecast.findIndex(d => d.day === day.day);
          if (dayIndex !== -1) {
            setSelectedDayIndex(dayIndex);
            setHighlightedDayIndex(dayIndex);
          }
        }}
        convertTemp={convertTemp}
        secondaryText={secondaryText}
        primaryText={primaryText}
      />

      {/* Detail Card - Glassmorphism */}
      {selectedDay && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-40"
            style={{
              background: 'rgba(58, 141, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={() => setSelectedDay(null)}
          />
          
          {/* Detail Card */}
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-3xl scrollbar-hide"
            style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              background: currentTheme.cardBgDark || currentTheme.cardBg || 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(240, 248, 255, 0.3) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${currentTheme.borderDark || currentTheme.border || 'rgba(255, 255, 255, 0.3)'}`,
              boxShadow: `
                0px 8px 32px rgba(25, 118, 210, 0.3),
                0px 4px 16px rgba(25, 118, 210, 0.25),
                inset 3px 3px 6px ${currentTheme.neoShadowLight || 'rgba(255, 255, 255, 0.5)'},
                inset -3px -3px 6px ${currentTheme.accent || 'rgba(30, 144, 255, 0.2)'},
                inset 5px 5px 10px ${currentTheme.neoShadowLight || 'rgba(255, 255, 255, 0.3)'},
                inset -5px -5px 10px ${currentTheme.accent || 'rgba(30, 144, 255, 0.15)'}
              `,
              width: 'clamp(280px, 85vw, 400px)',
              maxHeight: '80vh',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 p-2 rounded-full transition-all active:scale-95"
              style={{
                background: currentTheme.cardBgLight || 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${currentTheme.borderDark || currentTheme.border || 'rgba(255, 255, 255, 0.3)'}`,
                boxShadow: `0px 2px 8px ${currentTheme.accent || 'rgba(25, 118, 210, 0.2)'}`,
              }}
              aria-label="Đóng"
            >
              <X size={20} color={primaryText} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center" style={{ gap: 'clamp(0.5rem, 1.5vh, 0.75rem)' }}>
              {/* Day */}
              <span
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
                  fontWeight: 600,
                  color: primaryText,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {selectedDay.day}
              </span>

              {/* Icon */}
              <div className="flex items-center justify-center" style={{ width: 'clamp(70px, 18vw, 100px)', height: 'clamp(70px, 18vw, 100px)' }}>
                <IconWeather
                  code={selectedDay.icon}
                  motionEnabled={false}
                  size={typeof window !== 'undefined' ? Math.min(Math.max(70, window.innerWidth * 0.18), 100) : 85}
                  isDay={true}
                />
              </div>

              {/* Temperature */}
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                    fontWeight: 700,
                    color: primaryText,
                    lineHeight: 1,
                  }}
                >
                  {convertTemp(selectedDay.temp)}°
                </span>
                <span
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: 'clamp(1.25rem, 5vw, 2rem)',
                    fontWeight: 600,
                    color: secondaryText,
                    opacity: 0.7,
                  }}
                >
                  / {convertTemp(selectedDay.tempMin)}°
                </span>
              </div>

              {/* Biểu đồ lượng mưa */}
              <div
                className="w-full"
                style={{
                  marginTop: 'clamp(0.5rem, 1.5vh, 0.75rem)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    fontWeight: 600,
                    color: primaryText,
                    marginBottom: 'clamp(0.375rem, 1vh, 0.5rem)',
                    textAlign: 'center',
                  }}
                >
                  Lượng mưa dự báo
                </h3>
                <div
                  onClick={handleChartClick}
                  style={{
                    width: '100%',
                    height: 'clamp(150px, 35vw, 180px)',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <ReactFrappeChart
                    ref={chartRef}
                    type="line"
                    colors={[currentTheme.accent || currentTheme.primary || '#1976d2']}
                    lineOptions={{
                      regionFill: 1, // Tạo area fill bên dưới line
                      dotSize: 5,
                      hideDots: 0,
                    }}
                    axisOptions={{
                      xAxisMode: 'tick',
                      yAxisMode: 'tick',
                      xIsSeries: 1,
                    }}
                    height={typeof window !== 'undefined' ? Math.min(Math.max(150, window.innerWidth * 0.35), 180) : 165}
                    data={rainChartData}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div
                className="w-full"
                style={{
                  marginTop: 'clamp(0.5rem, 1.5vh, 0.75rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.375rem, 1vh, 0.5rem)',
                }}
              >
                {selectedDay.humidity && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: secondaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)' }}>
                      Độ ẩm
                    </span>
                    <span style={{ color: primaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', fontWeight: 600 }}>
                      {selectedDay.humidity}%
                    </span>
                  </div>
                )}
                {selectedDay.windSpeed && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: secondaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)' }}>
                      Tốc độ gió
                    </span>
                    <span style={{ color: primaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', fontWeight: 600 }}>
                      {selectedDay.windSpeed} km/h
                    </span>
                  </div>
                )}
                {selectedDay.pressure && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: secondaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)' }}>
                      Áp suất
                    </span>
                    <span style={{ color: primaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', fontWeight: 600 }}>
                      {selectedDay.pressure} hPa
                    </span>
                  </div>
                )}
                {(selectedDay.precipitationProbability !== undefined || selectedDay.rainChance !== undefined) && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: secondaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)' }}>
                      Khả năng mưa
                    </span>
                    <span style={{ color: primaryText, fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', fontWeight: 600 }}>
                      {selectedDay.precipitationProbability || selectedDay.rainChance || 0}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
