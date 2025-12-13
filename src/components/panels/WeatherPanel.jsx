import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { MetricsCard } from '../weather';
import WeatherHeader from '../weather/WeatherHeader';
import WeatherHero from '../weather/WeatherHero';
import WeatherHourly from '../weather/WeatherHourly';
import WeatherFooter from '../weather/WeatherFooter';
import { METRICS_COLORED_SHADOW } from '../../constants/styles';

// Danh sách các thành phố nổi tiếng ở Việt Nam
const POPULAR_CITIES = [
  { name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { name: 'Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { name: 'Huế', lat: 16.4637, lon: 107.5909 },
  { name: 'Nha Trang', lat: 12.2388, lon: 109.1967 },
];

// Helper để tính responsive dựa trên aspect ratio
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


export default function WeatherPanel({
  currentWeather,
  location,
  currentLocation = null,
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
  isDark = false,
  setIsMenuOpen,
  isPreview = false,
  lastUpdated = null,
  getTimeAgo = null,
  gpsEnabled = false,
  fetchWeatherData = null,
}) {
  const [responsivePadding, setResponsivePadding] = useState(getResponsivePadding);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const panelRef = useRef(null);
  
  // State để lưu weather data đã chọn từ hourly forecast
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [selectedTimeDate, setSelectedTimeDate] = useState(null);
  
  // Weather data hiển thị trên hero và metrics (dùng selectedWeather nếu có, không thì dùng currentWeather)
  const displayWeather = selectedWeather || currentWeather;
  
  // Reset selectedWeather và selectedTimeDate khi location hoặc currentWeather thay đổi
  useEffect(() => {
    setSelectedWeather(null);
    setSelectedTimeDate(null);
  }, [location, currentWeather?.weatherCode]);
  
  useEffect(() => {
    const updatePadding = () => setResponsivePadding(getResponsivePadding());
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  // Tìm index của thành phố hiện tại trong danh sách
  useEffect(() => {
    if (!isPreview && !gpsEnabled && location) {
      const cityIndex = POPULAR_CITIES.findIndex(
        city => city.name.toLowerCase().includes(location.toLowerCase()) || 
                location.toLowerCase().includes(city.name.toLowerCase())
      );
      if (cityIndex !== -1) {
        setCurrentCityIndex(cityIndex);
      }
    }
  }, [location, isPreview, gpsEnabled]);

  // Hàm chuyển thành phố
  const changeCity = (direction) => {
    if (isPreview || gpsEnabled || !fetchWeatherData) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentCityIndex + 1) % POPULAR_CITIES.length;
    } else {
      newIndex = (currentCityIndex - 1 + POPULAR_CITIES.length) % POPULAR_CITIES.length;
    }
    
    setCurrentCityIndex(newIndex);
    const city = POPULAR_CITIES[newIndex];
    fetchWeatherData(city.name, city.lat, city.lon);
  };

  // Swipe handlers - chỉ hoạt động khi không phải preview và không có GPS
  const handleTouchStart = (e) => {
    if (isPreview || gpsEnabled || !fetchWeatherData) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (isPreview || gpsEnabled || !fetchWeatherData) return;
    // Cho phép scroll dọc nhưng ngăn scroll ngang khi swipe
    const diffX = Math.abs(touchStartX.current - e.touches[0].clientX);
    const diffY = Math.abs(touchStartY.current - e.touches[0].clientY);
    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (isPreview || gpsEnabled || !fetchWeatherData) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    
    // Chỉ swipe ngang khi diffX lớn hơn diffY (vuốt ngang rõ ràng)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe sang trái - next city
        changeCity('next');
      } else {
        // Swipe sang phải - previous city
        changeCity('prev');
      }
    }
  };

  // Keyboard handlers cho PC - mũi tên trái/phải
  useEffect(() => {
    if (isPreview || gpsEnabled || !fetchWeatherData) return;
    
    const handleKeyDown = (e) => {
      // Chỉ xử lý khi không phải đang focus vào input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeCity('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeCity('next');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCityIndex, isPreview, gpsEnabled, fetchWeatherData]);

  if (!currentWeather || !location) {
    return null;
  }

  const newAccentColor = '#64B5F6';
  
  const otherSectionStyle = {
    marginLeft: 'clamp(7.6px, 2.375vw, 14.25px)', // Giảm 5% (x 0.95)
    marginRight: 'clamp(7.6px, 2.375vw, 14.25px)', // Giảm 5% (x 0.95)
    transform: 'scale(1.05)', // Tăng 5% kích thước
  };
  
  // Determine if dark mode
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  const metricsCardStyle = {
    background: currentTheme.cardBgStrong || currentTheme.cardBg || 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
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
    borderRadius: '2rem',
    border: isDarkMode ? `1px solid ${currentTheme.border || 'rgba(255, 255, 255, 0.15)'}` : 'none',
  };

  return (
    <section
      ref={panelRef}
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isPreview && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (setPage) {
                if (import.meta.env.DEV) {
                  console.log('Quay lại MapPanel');
                }
                setPage(2);
              }
            }}
            className="absolute transition-all active:scale-95 hover:opacity-80"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 'clamp(0.375rem, 2vw, 0.5rem)',
              margin: 0,
              outline: 'none',
              boxShadow: 'none',
              pointerEvents: 'auto',
              zIndex: 100,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              left: 'clamp(0.75rem, 3vw, 1.5rem)',
              top: 'clamp(1.5rem, 4vh, 2rem)',
              marginTop: '1px',
            }}
            aria-label="Quay lại"
          >
            <ChevronLeft size={typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth * 0.075, 30)) : 30} color="#1565c0" />
          </button>
        </>
      )}

      <WeatherHeader
        location={location}
        primaryText={primaryText}
        secondaryText={secondaryText}
        setPage={setPage}
        openDetail={openDetail}
        openSettings={openSettings}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentTheme={currentTheme}
        isPreview={isPreview}
        lastUpdated={lastUpdated}
        getTimeAgo={getTimeAgo}
        gpsEnabled={gpsEnabled}
      />
      
      <div>
        <WeatherHero
          temp={displayWeather.temp}
          condition={displayWeather.condition || currentWeather.condition}
          weatherCode={displayWeather.weatherCode || currentWeather.weatherCode}
          convertTemp={convertTemp}
          motionEnabled={motionEnabled}
          windSpeed={displayWeather.windSpeed || currentWeather.windSpeed}
          currentTheme={currentTheme}
          primaryText={primaryText}
          isDark={isDark}
          selectedTimeDate={selectedTimeDate}
        />

        <div style={{...otherSectionStyle, position: 'relative', zIndex: 1}} className="mb-2">
          <MetricsCard
            rainChance={displayWeather.rainChance !== undefined ? displayWeather.rainChance : currentWeather.rainChance}
            humidity={displayWeather.humidity !== undefined ? displayWeather.humidity : currentWeather.humidity}
            windSpeed={displayWeather.windSpeed !== undefined ? displayWeather.windSpeed : currentWeather.windSpeed}
            accentColor={currentTheme.accent || newAccentColor}
            primaryText={primaryText}
            secondaryText={secondaryText}
            style={{...metricsCardStyle, position: 'relative', zIndex: 1}}
          />
        </div>

        <WeatherHourly
          hourlyForecast={hourlyForecast}
          convertTemp={convertTemp}
          setPage={setPage}
          isPreview={isPreview}
          primaryText={primaryText}
          secondaryText={secondaryText}
          currentTheme={currentTheme}
          onHourClick={(hourData) => {
            // Update hero và metrics khi click vào hourly card
            setSelectedWeather({
              temp: hourData.temp,
              condition: hourData.condition || currentWeather.condition,
              weatherCode: hourData.weatherCode || hourData.icon,
              windSpeed: hourData.windSpeed,
              humidity: hourData.humidity,
              rainChance: hourData.rainChance || hourData.precipitation
            });
            // Lưu timeDate để pass vào WeatherHero cho icon ngày/đêm
            setSelectedTimeDate(hourData.timeDate || null);
          }}
        />

        <WeatherFooter
          location={location}
          detailedAddress={currentLocation?.detailedAddress || location}
          temp={currentWeather.temp}
          weatherCode={currentWeather.weatherCode}
          convertTemp={convertTemp}
          setPage={setPage}
          isPreview={isPreview}
          currentTheme={currentTheme}
          primaryText={primaryText}
        />
      </div>
    </section>
  );
}
