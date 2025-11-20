import React, { useState, useEffect, useRef } from 'react';
import WeatherPanel from './components/WeatherPanel';
import ForecastPanel from './components/ForecastPanel';
import MapPanel from './components/MapPanel';
import DetailedForecastPanel from './components/DetailedForecastPanel';
import SettingsDrawer from './components/SettingsDrawer';
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './components/ui/Toast';
import OfflineIndicator from './components/layout/OfflineIndicator';
import BackgroundMusic from './components/layout/BackgroundMusic';
import SplashScreen from './components/layout/SplashScreen';
import { SkeletonWeatherPanel } from './components/UI/SkeletonLoader';
import useWeatherTheme from './hooks/useWeatherTheme';
import { weatherAPI } from './utils/api';
import { mapWeatherCodeToIcon } from './utils/weather';
import { DAY_NAMES } from './constants/weather';
import { MenuDrawer } from './components/KebabMenu';
import './styles/globals.css';
import './styles/glassmorphism.css';
import './styles/animations.css';

export default function App() {
  const [ui, setUI] = useState({
    page: 0,
    showDetail: false,
    isMenuOpen: false,
    isDrawerOpen: false,
  });

  const [settings, setSettings] = useState({
    themeMode: 'weather-reactive',
    isDark: false,
    motionEnabled: true,
    autoThemeByTime: false,
    tempUnit: 'C',
    soundEnabled: false,
  });
  const [weather, setWeather] = useState(null);
  const [preview, setPreview] = useState({
    location: null,
    weather: null,
    hourlyForecast: [],
    dailyForecast: [],
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const toast = useToast();
  const detailData = {
    date: 'Saturday, Nov 16',
    rainChances: [],
    metrics: []
  };
  const { currentTheme, primaryText, secondaryText } = useWeatherTheme(
    settings.themeMode,
    settings.isDark,
    weather?.weatherCode ?? 1
  );
  const audioRef = useRef(null);
  const weatherCache = useRef(new Map());
  const convertTemp = t => settings.tempUnit === 'F' ? Math.round((t * 9) / 5 + 32) : Math.round(t);

  const fetchWeatherData = async (city = null, lat = null, lon = null, forceRefresh = false) => {
    const cacheKey = city || `${lat},${lon}`;
    const cached = weatherCache.current.get(cacheKey);
    const CACHE_DURATION = 120000;
    
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setWeather(cached.data.weather);
      setDailyForecast(cached.data.dailyForecast);
      setHourlyForecast(cached.data.hourlyForecast);
      setCurrentLocation(cached.data.currentLocation);
      
      fetchWeatherData(city, lat, lon, true).catch(err => {
        if (import.meta.env.DEV) {
          console.log('[CACHE] Background refresh failed, using cached data');
        }
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const currentData = await weatherAPI.getCurrentWeather(city, lat, lon);
      
      const forecastData = await weatherAPI.getForecast(city, lat, lon, 8);
      
      const hourlyData = await weatherAPI.getHourlyForecast(city, lat, lon, 24);

      const mainRawWeatherCode = currentData.weather.weatherCode;
      const mainMappedIconCode = mapWeatherCodeToIcon(mainRawWeatherCode);
      if (import.meta.env.DEV) {
        console.log('Main - Raw weatherCode:', mainRawWeatherCode, 'Mapped to:', mainMappedIconCode);
      }

      setWeather({
        temperature: currentData.weather.temperature,
        condition: currentData.weather.condition,
        location: currentData.location.city,
        humidity: currentData.weather.humidity || 65,
        windSpeed: currentData.weather.windSpeed,
        weatherCode: mainMappedIconCode,
        updatedAt: currentData.timestamp,
        tempMax: forecastData.forecast[0]?.tempMax || 24,
        tempMin: forecastData.forecast[0]?.tempMin || 18,
        rainChance: currentData.weather.precipitation || 10,
        pressure: currentData.weather.pressure || 1012,
        visibility: 10
      });

      setCurrentLocation({
        lat: currentData.location.lat,
        lon: currentData.location.lon,
        city: currentData.location.city
      });

      const updatedDailyForecast = forecastData.forecast.map((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Hôm nay' : DAY_NAMES[date.getDay()];
        
        const mappedIcon = mapWeatherCodeToIcon(day.weatherCode);
        if (import.meta.env.DEV) {
          console.log(`[FORECAST] Day ${index} (${dayName}): weatherCode=${day.weatherCode}, condition=${day.condition}, mappedIcon=${mappedIcon}`);
        }
        
        return {
          day: dayName,
          temp: day.tempMax,
          tempMin: day.tempMin,
          icon: mappedIcon,
          desc: day.condition,
          weatherCode: day.weatherCode,
          windSpeed: day.windSpeed,
          precipitationProbability: day.precipitationProbability,
          humidity: day.humidity || 65,
          pressure: day.pressure || 1013
        };
      });
      setDailyForecast(updatedDailyForecast);

      const updatedHourlyForecast = hourlyData.hourly.slice(0, 8).map((hour, index) => {
        const hourDate = new Date(hour.time);
        const timeStr = index === 0 ? 'Now' : hourDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        
        return {
          time: timeStr,
          temp: hour.temperature,
          icon: mapWeatherCodeToIcon(hour.weatherCode),
          weatherCode: hour.weatherCode
        };
      });
      setHourlyForecast(updatedHourlyForecast);
      
      weatherCache.current.set(cacheKey, {
        data: {
          weather: {
            temperature: currentData.weather.temperature,
            condition: currentData.weather.condition,
            location: currentData.location.city,
            humidity: currentData.weather.humidity || 65,
            windSpeed: currentData.weather.windSpeed,
            weatherCode: mainMappedIconCode,
            updatedAt: currentData.timestamp,
            tempMax: forecastData.forecast[0]?.tempMax || 24,
            tempMin: forecastData.forecast[0]?.tempMin || 18,
            rainChance: currentData.weather.precipitation || 10,
            pressure: currentData.weather.pressure || 1012,
            visibility: 10
          },
          dailyForecast: updatedDailyForecast,
          hourlyForecast: updatedHourlyForecast,
          currentLocation: {
            lat: currentData.location.lat,
            lon: currentData.location.lon,
            city: currentData.location.city
          }
        },
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error(`[MAIN] Error fetching weather data for ${city || `${lat},${lon}`}:`, error);
      
      setWeather(null);
      setCurrentLocation(null);
      setHourlyForecast([]);
      setDailyForecast([]);
      
      if (error.response) {
        console.error(`[MAIN] Response status: ${error.response.status}`);
        console.error(`[MAIN] Response data:`, error.response.data);
        if (error.response.status === 429) {
          toast.error('Quá nhiều requests. Vui lòng đợi một chút rồi thử lại.');
        } else if (error.response.status === 404) {
          toast.error('Không tìm thấy địa điểm. Vui lòng thử lại.');
        } else {
          toast.error('Không thể tải dữ liệu thời tiết. Vui lòng thử lại.');
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn('[MAIN] Backend không khả dụng hoặc network error. Hiển thị skeleton.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData('Hanoi');
  }, []);

  useEffect(() => {
    if (!currentLocation) return;
    
    const handleVisibilityChange = () => {
      if (!document.hidden && currentLocation) {
        fetchWeatherData(null, currentLocation.lat, currentLocation.lon, true);
      }
    };

    const handleFocus = () => {
      if (currentLocation) {
        fetchWeatherData(null, currentLocation.lat, currentLocation.lon, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentLocation]);

  useEffect(() => {
    if (!currentLocation) return;
    
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchWeatherData(null, currentLocation.lat, currentLocation.lon, true);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [currentLocation]);

  const handleSearch = (q) => {
    if (q && q.trim()) {
      fetchWeatherData(q);
    }
  };
  
  const handleLocationChange = (lat, lon) => {
    fetchWeatherData(null, lat, lon);
  };

  const fetchPreviewWeather = async (lat, lon, cityName) => {
    setIsLoading(true);
    try {
      const currentData = await weatherAPI.getCurrentWeather(null, lat, lon);
      const forecastData = await weatherAPI.getForecast(null, lat, lon, 8);
      const hourlyData = await weatherAPI.getHourlyForecast(null, lat, lon, 24);

      const updatedDailyForecast = forecastData.forecast.map((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Hôm nay' : DAY_NAMES[date.getDay()];
        
        return {
          day: dayName,
          temp: day.tempMax,
          tempMin: day.tempMin,
          icon: mapWeatherCodeToIcon(day.weatherCode),
          desc: day.condition,
          weatherCode: day.weatherCode,
          windSpeed: day.windSpeed,
          precipitationProbability: day.precipitationProbability,
          humidity: day.humidity || 65,
          pressure: day.pressure || 1013
        };
      });

      const updatedHourlyForecast = hourlyData.hourly.slice(0, 8).map((hour, index) => {
        const hourDate = new Date(hour.time);
        const timeStr = index === 0 ? 'Now' : hourDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        return {
          time: timeStr,
          temp: hour.temperature,
          icon: mapWeatherCodeToIcon(hour.weatherCode),
          weatherCode: hour.weatherCode
        };
      });

      const rawWeatherCode = currentData.weather.weatherCode;
      const mappedIconCode = mapWeatherCodeToIcon(rawWeatherCode);
      if (import.meta.env.DEV) {
        console.log(`[PREVIEW] Location: ${cityName}, Raw weatherCode: ${rawWeatherCode}, Mapped to icon: ${mappedIconCode}, Condition: ${currentData.weather.condition}`);
      }

      setPreview({
        location: { lat, lon, city: cityName || currentData.location.city },
        weather: {
          temperature: currentData.weather.temperature,
          condition: currentData.weather.condition,
          location: cityName || currentData.location.city,
          humidity: currentData.weather.humidity || 65,
          windSpeed: currentData.weather.windSpeed,
          weatherCode: mappedIconCode,
          tempMax: forecastData.forecast[0]?.tempMax || currentData.weather.temperature,
          tempMin: forecastData.forecast[0]?.tempMin || currentData.weather.temperature,
          rainChance: currentData.weather.precipitation || 10,
          pressure: currentData.weather.pressure || 1012,
        },
        hourlyForecast: updatedHourlyForecast,
        dailyForecast: updatedDailyForecast,
      });
      setUI(prev => ({ ...prev, page: 3 })); // Chuyển sang preview panel
    } catch (error) {
      console.error(`[PREVIEW] Error fetching weather for ${cityName}:`, error);
      if (error.response) {
        console.error(`[PREVIEW] Response status: ${error.response.status}`);
        console.error(`[PREVIEW] Response data:`, error.response.data);
        if (error.response.status === 429) {
          toast.error('Quá nhiều requests. Vui lòng đợi một chút rồi thử lại.');
        } else if (error.response.status === 404) {
          toast.error('Không tìm thấy địa điểm. Vui lòng thử lại.');
        }
      }
      setPreview(prev => ({ ...prev, weather: null }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewLocation = (lat, lon, cityName) => {
    fetchPreviewWeather(lat, lon, cityName);
  };
  if (showSplash) {
    return (
      <SplashScreen 
        onComplete={() => setShowSplash(false)} 
      />
    );
  }

  return (
    <>
      <OfflineIndicator />
      <BackgroundMusic enabled={settings.soundEnabled} volume={0.15} />
      <div className="phone-container">
        <div 
          className="finisher-header" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        ></div>
        <div className="app-content-wrapper">
          <ToastContainer />
          <DetailedForecastPanel
            showDetail={ui.showDetail}
            setShowDetail={(val) => setUI(prev => ({ ...prev, showDetail: val }))}
            detailData={detailData}
            currentTheme={currentTheme}
            primaryText={primaryText}
            secondaryText={secondaryText}
            convertTemp={convertTemp}
            motionEnabled={settings.motionEnabled}
          />
          <SettingsDrawer
            isDrawerOpen={ui.isDrawerOpen}
            setIsDrawerOpen={(val) => setUI(prev => ({ ...prev, isDrawerOpen: val }))}
            themeMode={settings.themeMode}
            setThemeMode={(val) => setSettings(prev => ({ ...prev, themeMode: val }))}
            isDark={settings.isDark}
            setIsDark={(val) => setSettings(prev => ({ ...prev, isDark: val }))}
            soundEnabled={settings.soundEnabled}
            setSoundEnabled={(val) => setSettings(prev => ({ ...prev, soundEnabled: val }))}
            motionEnabled={settings.motionEnabled}
            setMotionEnabled={(val) => setSettings(prev => ({ ...prev, motionEnabled: val }))}
            tempUnit={settings.tempUnit}
            setTempUnit={(val) => setSettings(prev => ({ ...prev, tempUnit: val }))}
            autoThemeByTime={settings.autoThemeByTime}
            setAutoThemeByTime={(val) => setSettings(prev => ({ ...prev, autoThemeByTime: val }))}
            currentTheme={currentTheme}
            primaryText={primaryText}
            secondaryText={secondaryText}
          />
          <MenuDrawer
            isOpen={ui.isMenuOpen}
            setIsOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
            setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
            openDetail={() => setUI(prev => ({ ...prev, showDetail: true }))}
            openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
            primaryText={primaryText}
          />
          <div className="h-full flex flex-col">
            <div className="flex-1 relative min-h-0" style={{ overflow: 'visible' }}>
              {isLoading || !weather || !currentLocation ? (
                <SkeletonWeatherPanel />
              ) : (
                <div className={`h-full ${ui.page === 0 ? 'block' : 'hidden'}`}>
                  <WeatherPanel
                    location={weather.location}
                    currentWeather={{
                      temp: weather.temperature,
                      condition: weather.condition,
                      windSpeed: weather.windSpeed,
                      rainChance: weather.rainChance,
                      pressure: weather.pressure,
                      weatherCode: weather.weatherCode
                    }}
                    hourlyForecast={hourlyForecast}
                    dailyForecast={dailyForecast}
                    convertTemp={convertTemp}
                    motionEnabled={settings.motionEnabled}
                    currentTheme={currentTheme}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                    onOpenDrawer={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
                    setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                    openDetail={() => setUI(prev => ({ ...prev, showDetail: true }))}
                    openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
                    isMenuOpen={ui.isMenuOpen}
                    setIsMenuOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
                  />
                </div>
              )}
              
              {isLoading || dailyForecast.length === 0 ? (
                <SkeletonWeatherPanel />
              ) : (
                <div className={`h-full ${ui.page === 1 ? 'block' : 'hidden'}`}>
                  <ForecastPanel
                    dailyForecast={dailyForecast}
                    convertTemp={convertTemp}
                    motionEnabled={settings.motionEnabled}
                    currentTheme={currentTheme}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                    onShowDetail={(day) => {
                      setUI(prev => ({ ...prev, showDetail: true }));
                    }}
                    setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                    openDetail={() => setUI(prev => ({ ...prev, showDetail: true }))}
                    openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
                    isMenuOpen={ui.isMenuOpen}
                    setIsMenuOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
                  />
                </div>
              )}
              {ui.page === 2 && (
                <div className="h-full">
                  <MapPanel
                    key="map-panel"
                    mockSearch={handleSearch}
                    currentLocation={currentLocation}
                    onLocationChange={handleLocationChange}
                    onPreviewLocation={handlePreviewLocation}
                    motionEnabled={settings.motionEnabled}
                    currentTheme={currentTheme}
                    primaryText={primaryText}
                    setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                    openDetail={() => setUI(prev => ({ ...prev, showDetail: true }))}
                    openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
                    isMenuOpen={ui.isMenuOpen}
                    setIsMenuOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
                    isVisible={true}
                  />
                </div>
              )}
              {ui.page === 3 && preview.weather && preview.location && (
                <div className="h-full">
                  <WeatherPanel
                    location={preview.weather.location}
                    currentWeather={{
                      temp: preview.weather.temperature,
                      condition: preview.weather.condition,
                      windSpeed: preview.weather.windSpeed,
                      rainChance: preview.weather.rainChance,
                      pressure: preview.weather.pressure,
                      weatherCode: preview.weather.weatherCode
                    }}
                    hourlyForecast={preview.hourlyForecast}
                    dailyForecast={preview.dailyForecast}
                    convertTemp={convertTemp}
                    motionEnabled={false}
                    currentTheme={currentTheme}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                    onOpenDrawer={() => {}}
                    setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                    openDetail={() => {}}
                    openSettings={() => {}}
                    isMenuOpen={false}
                    setIsMenuOpen={() => {}}
                    isPreview={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}