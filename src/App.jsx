import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import WeatherPanel from './components/panels/WeatherPanel';
import ForecastPanel from './components/panels/ForecastPanel';
import MapPanel from './components/panels/MapPanel';
import SettingsDrawer from './components/SettingsDrawer';
import { ToastContainer } from './components/UI/Toast';
import { useToast } from './components/UI/Toast';
import OfflineIndicator from './components/layout/OfflineIndicator';
import BackgroundMusic from './components/layout/BackgroundMusic';
import SplashScreen from './components/layout/SplashScreen';
import { SkeletonWeatherPanel, SkeletonMapPanel } from './components/UI/SkeletonLoader';
import PullToRefresh from './components/UI/PullToRefresh';
import RefreshIndicator from './components/UI/RefreshIndicator';
import useWeatherTheme from './hooks/useWeatherTheme';
import useFinisherHeader from './hooks/useFinisherHeader';
import { useSWRWeather } from './hooks/useSWRWeather';
import { usePreviewWeather } from './hooks/usePreviewWeather';
import { useAppGPS } from './hooks/useAppGPS';
import { useHeatmapData } from './hooks/useHeatmapData';
import { MenuDrawer } from './components/KebabMenu';
import './styles/globals.css';
import './styles/glassmorphism.css';
import './styles/animations.css';

export default function App() {
  const [ui, setUI] = useState({
    page: 0,
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
    gpsEnabled: false,
    heatmapEnabled: true, // Bat mac dinh de load ngay tu splash
  });
  const [showSplash, setShowSplash] = useState(true);
  const toast = useToast();


  const {
    weather,
    currentLocation,
    currentLocationRef,
    hourlyForecast,
    dailyForecast,
    isLoading,
    isRefreshing,
    lastUpdated,
    getTimeAgo,
    fetchWeatherData
  } = useSWRWeather();

  const { preview, previewLoading, fetchPreviewWeather } = usePreviewWeather();
  
  const { toggleGPS } = useAppGPS(settings, setSettings, currentLocationRef, fetchWeatherData);
  
  // Fetch heatmap data ngay tu splash screen
  const { heatmapPoints, heatmapLoading } = useHeatmapData(settings.heatmapEnabled);
  
  const mapCurrentLocation = currentLocation || currentLocationRef.current || { lat: 21.0285, lon: 105.8542, city: 'Hanoi' };

  const { currentTheme, primaryText, secondaryText } = useWeatherTheme(
    settings.themeMode,
    settings.isDark,
    weather?.weatherCode ?? 1
  );

  useFinisherHeader(settings.isDark);
  const convertTemp = useCallback((t) => {
    return settings.tempUnit === 'F' ? Math.round((t * 9) / 5 + 32) : Math.round(t);
  }, [settings.tempUnit]);


  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchWeatherData('Hanoi');
    }
    
  }, []); 


  const handlePullRefresh = useCallback(async () => {
    if (currentLocation) {
      try {
        await fetchWeatherData(
          currentLocation.city,
          currentLocation.lat,
          currentLocation.lon,
          { forceRefresh: true, preserveCity: true }
        );
      } catch (error) {
        if (error.response?.status === 429) {
          toast.error('Quá nhiều requests. Vui lòng đợi một chút rồi thử lại.');
        } else {
          toast.error('Không thể làm mới dữ liệu. Vui lòng thử lại.');
        }
      }
    }
  }, [currentLocation, fetchWeatherData, toast]);


  const handleSearch = useCallback((q) => {
    if (q && q.trim()) {
      fetchWeatherData(q);
    }
  }, [fetchWeatherData]);
  
  const handleLocationChange = useCallback((lat, lon) => {
    fetchWeatherData(null, lat, lon, { silent: true, preserveCity: false });
  }, [fetchWeatherData]);

  const handlePreviewLocation = useCallback(async (lat, lon, cityName) => {
    const success = await fetchPreviewWeather(lat, lon, cityName);
    if (success) {
      setUI(prev => ({ ...prev, page: 3 })); 
    }
  }, [fetchPreviewWeather]);




  const currentWeatherMemo = useMemo(() => weather ? {
    temp: weather.temperature,
    condition: weather.condition,
    windSpeed: weather.windSpeed,
    rainChance: weather.rainChance,
    pressure: weather.pressure,
    weatherCode: weather.weatherCode,
    humidity: weather.humidity,
    tempMax: weather.tempMax,
    tempMin: weather.tempMin
  } : null, [weather]);


  const handleOpenDrawer = useCallback(() => setUI(prev => ({ ...prev, isDrawerOpen: true })), []);
  const handleSetPage = useCallback((val) => setUI(prev => ({ ...prev, page: val })), []);
  const handleOpenDetail = useCallback(() => {}, []);
  const handleSetIsMenuOpen = useCallback((val) => setUI(prev => ({ ...prev, isMenuOpen: val })), []);

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
      <BackgroundMusic 
        enabled={settings.soundEnabled} 
        volume={0.10}
      />
      <div className={`phone-container ${settings.isDark ? 'dark-mode' : ''}`}>
        {settings.isDark && (
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
        )}
        <div className="app-content-wrapper" style={{ position: 'relative' }}>
          <ToastContainer />
          <RefreshIndicator 
            isRefreshing={isRefreshing} 
            lastUpdated={lastUpdated}
            getTimeAgo={getTimeAgo}
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
            gpsEnabled={settings.gpsEnabled}
            toggleGPS={toggleGPS}
            heatmapEnabled={settings.heatmapEnabled}
            setHeatmapEnabled={(val) => setSettings(prev => ({ ...prev, heatmapEnabled: val }))}
          />
          <MenuDrawer
            isOpen={ui.isMenuOpen}
            setIsOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
            currentTheme={currentTheme}
            primaryText={primaryText}
            setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
            openDetail={() => {}}
            openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
          />
          <div className="h-full flex flex-col">
            <div className="flex-1 relative min-h-0" style={{ overflow: 'visible' }}>
              {isLoading || !weather || !currentLocation ? (
                <SkeletonWeatherPanel />
              ) : (
                <div className={`h-full ${ui.page === 0 ? 'block' : 'hidden'}`}>
                  <PullToRefresh onRefresh={handlePullRefresh} disabled={isLoading}>
                    <WeatherPanel
                      location={weather.location}
                      currentLocation={currentLocation}
                      currentWeather={currentWeatherMemo}
                      hourlyForecast={hourlyForecast}
                      dailyForecast={dailyForecast}
                      convertTemp={convertTemp}
                      motionEnabled={settings.motionEnabled}
                      currentTheme={currentTheme}
                      primaryText={primaryText}
                      secondaryText={secondaryText}
                      onOpenDrawer={handleOpenDrawer}
                      setPage={handleSetPage}
                      openDetail={handleOpenDetail}
                      openSettings={handleOpenDrawer}
                      isMenuOpen={ui.isMenuOpen}
                      isDark={settings.isDark}
                      setIsMenuOpen={handleSetIsMenuOpen}
                      lastUpdated={lastUpdated}
                      getTimeAgo={getTimeAgo}
                      gpsEnabled={settings.gpsEnabled}
                      fetchWeatherData={fetchWeatherData}
                    />
                  </PullToRefresh>
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
                    onShowDetail={() => {}}
                    setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                    openDetail={() => {}}
                    openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
                    isMenuOpen={ui.isMenuOpen}
                    setIsMenuOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
                    location={weather?.location}
                    currentLocation={currentLocation}
                    gpsEnabled={settings.gpsEnabled}
                  />
                </div>
              )}
              {ui.page === 2 && (
                <div className="h-full">
                  {/* Chỉ hiển thị skeleton khi lần đầu load (chưa có location nào), không hiển thị khi di chuyển marker/search */}
                  {!mapCurrentLocation || (!mapCurrentLocation.lat && !mapCurrentLocation.lon) ? (
                    <SkeletonMapPanel />
                  ) : (
                    <MapPanel
                      key="map-panel"
                      mockSearch={handleSearch}
                      currentLocation={mapCurrentLocation}
                      onLocationChange={handleLocationChange}
                      onPreviewLocation={handlePreviewLocation}
                      motionEnabled={settings.motionEnabled}
                      currentTheme={currentTheme}
                      primaryText={primaryText}
                      setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                      openDetail={() => {}}
                      openSettings={() => setUI(prev => ({ ...prev, isDrawerOpen: true }))}
                      isMenuOpen={ui.isMenuOpen}
                      setIsMenuOpen={(val) => setUI(prev => ({ ...prev, isMenuOpen: val }))}
                      isVisible={true}
                      heatmapEnabled={settings.heatmapEnabled}
                      heatmapPoints={heatmapPoints}
                      heatmapLoading={heatmapLoading}
                      isDark={settings.isDark}
                    />
                  )}
                </div>
              )}
              {ui.page === 3 && (
                <div className="h-full">
                  {previewLoading || !preview.weather || !preview.location ? (
                    <SkeletonWeatherPanel />
                  ) : (
                    <WeatherPanel
                    location={preview.weather.location}
                    currentWeather={{
                      temp: preview.weather.temperature,
                      condition: preview.weather.condition,
                      windSpeed: preview.weather.windSpeed,
                      rainChance: preview.weather.rainChance,
                      pressure: preview.weather.pressure,
                      weatherCode: preview.weather.weatherCode,
                      humidity: preview.weather.humidity,
                      tempMax: preview.weather.tempMax,
                      tempMin: preview.weather.tempMin
                    }}
                    hourlyForecast={preview.hourlyForecast}
                    dailyForecast={preview.dailyForecast}
                    convertTemp={convertTemp}
                    motionEnabled={false}
                    currentTheme={currentTheme}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                    onOpenDrawer={() => {}}
                    isDark={settings.isDark}
                    setPage={(val) => setUI(prev => ({ ...prev, page: val }))}
                    openDetail={() => {}}
                    openSettings={() => {}}
                    isMenuOpen={false}
                    setIsMenuOpen={() => {}}
                    isPreview={true}
                  />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}