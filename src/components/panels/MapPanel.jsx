import React, { useEffect, useState, useRef, useCallback } from 'react';
import { mapAPI, weatherAPI } from '../../utils/api';
import { useToast } from '../UI/Toast';
import MapStyles from '../map/MapStyles';
import MapHeader from '../map/MapHeader';
import MapSearchSection from '../map/MapSearchSection';
import MapContainer from '../map/MapContainer';
import MapCurrentLocation from '../map/MapCurrentLocation';
import MapPreviewCard from '../map/MapPreviewCard';

const cityDataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export default function MapPanel({
  mockSearch,
  currentLocation = { lat: 21.0285, lon: 105.8542, city: 'Hanoi' },
  onLocationChange,
  onPreviewLocation,
  motionEnabled,
  currentTheme,
  primaryText,
  setPage,
  openDetail,
  openSettings,
  isMenuOpen,
  setIsMenuOpen,
  isVisible = true,
  heatmapEnabled = false,
  heatmapPoints = [],
  heatmapLoading = false,
  isDark = false,
}) {
  const [mapCenter, setMapCenter] = useState([currentLocation.lat, currentLocation.lon]);
  const [markerPosition, setMarkerPosition] = useState([currentLocation.lat, currentLocation.lon]);
  const [locationName, setLocationName] = useState(currentLocation.city);
  const [error, setError] = useState(null);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [markerTemperature, setMarkerTemperature] = useState(null);
  const mapRef = useRef(null);
  const toast = useToast();
  const isUserClickRef = useRef(false);

  useEffect(() => {
    if (isUserClickRef.current) {
      return;
    }
    
    if (currentLocation && currentLocation.lat && currentLocation.lon) {
      const newCenter = [currentLocation.lat, currentLocation.lon];
      const currentCenterKey = `${Math.round(mapCenter[0] * 10000)}_${Math.round(mapCenter[1] * 10000)}`;
      const newCenterKey = `${Math.round(newCenter[0] * 10000)}_${Math.round(newCenter[1] * 10000)}`;
      
      // Chỉ update nếu thực sự khác
      if (currentCenterKey !== newCenterKey) {
        setMapCenter(newCenter);
        setMarkerPosition(newCenter);
        setLocationName(currentLocation.city || 'Unknown');
      }
    }
  }, [currentLocation, shouldRenderMap, mapCenter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderMap(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);


  const fetchPreviewCardData = async (lat, lon, cityName) => {
    setError(null);
    try {
      const currentData = await weatherAPI.getCurrentWeather(null, lat, lon);
      const rawWeatherCode = currentData.weather.weatherCode;
      
      setPreviewData({
        location: { lat, lon, city: cityName },
        weather: {
          temperature: currentData.weather.temperature,
          condition: currentData.weather.condition,
          weatherCode: rawWeatherCode,
          tempMax: currentData.weather.temperature,
          tempMin: currentData.weather.temperature,
        }
      });
      
      if (onLocationChange) {
        onLocationChange(lat, lon);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Preview card fetch error:', err);
      }
      setError('Lỗi khi lấy dữ liệu thời tiết');
      setPreviewData(null);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') return;
    
    setError(null);
    
    try {
      const response = await mapAPI.searchLocation(query);
      if (response.results && response.results.length > 0) {
        const location = response.results[0];
        const newCenter = [location.lat, location.lon];
        setMapCenter(newCenter);
        setMarkerPosition(newCenter);
        const locationName = location.nameVi || location.name;
        setLocationName(locationName);
        
        await fetchPreviewCardData(location.lat, location.lon, locationName);
      } else {
        setError('Không tìm thấy địa điểm');
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Search error:', err);
      }
      setError('Lỗi khi tìm kiếm địa điểm');
    }
  };

  const handleMarkerClick = useCallback((lat, lng) => {
    let temperature = null;
    const cacheKey = `${Math.round(lat * 100) / 100}_${Math.round(lng * 100) / 100}`;
    const cached = cityDataCache.get(cacheKey);
    if (cached && cached.data) {
      temperature = cached.data.temperature;
    }
    
    setMarkerTemperature(temperature);
  }, []);

  const handleMapClick = async (e) => {
    const lat = e.latlng?.lat || (Array.isArray(e.latlng) ? e.latlng[0] : e.latlng?.latitude);
    const lng = e.latlng?.lng || (Array.isArray(e.latlng) ? e.latlng[1] : e.latlng?.longitude);
    
    if (!lat || !lng) return;
    
    isUserClickRef.current = true;
    
    const newCenter = [lat, lng];
    
    // Update marker ngay lập tức
    setMarkerPosition(newCenter);
    setMapCenter(newCenter);
    
    const tempLocationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    setLocationName(tempLocationName);
    
    const cacheKey = `${Math.round(lat * 100) / 100}_${Math.round(lng * 100) / 100}`;
    
    const cached = cityDataCache.get(cacheKey);
    if (cached && cached.data && cached.data.temperature) {
      setMarkerTemperature(cached.data.temperature);
      if (cached.locationName) {
        setLocationName(cached.locationName);
      }
    }
    
    // Load data trước
    Promise.all([
      weatherAPI.getCurrentWeather(null, lat, lng).catch(() => null),
      mapAPI.reverseGeocode(lat, lng).catch(() => null)
    ]).then(([weatherData, locationData]) => {
      if (weatherData && weatherData.weather) {
        const temperature = weatherData.weather.temperature;
        setMarkerTemperature(temperature);
        
        const existingCache = cityDataCache.get(cacheKey) || {};
        cityDataCache.set(cacheKey, {
          ...existingCache,
          data: {
            ...existingCache.data,
            temperature: temperature
          },
          timestamp: Date.now()
        });
      }
      
      let finalLocationName = tempLocationName;
      if (locationData) {
        finalLocationName = locationData.nameVi || locationData.name || tempLocationName;
        setLocationName(finalLocationName);
        
        const existingCache = cityDataCache.get(cacheKey) || {};
        cityDataCache.set(cacheKey, {
          ...existingCache,
          locationName: finalLocationName,
          timestamp: Date.now()
        });
      }
      
      if (weatherData && weatherData.weather) {
        const rawWeatherCode = weatherData.weather.weatherCode;
        setPreviewData({
          location: { lat, lon: lng, city: finalLocationName },
          weather: {
            temperature: weatherData.weather.temperature,
            condition: weatherData.weather.condition,
            weatherCode: rawWeatherCode,
            tempMax: weatherData.weather.temperature,
            tempMin: weatherData.weather.temperature,
          }
        });
        
        // CHỈ GỌI onLocationChange SAU KHI DATA ĐÃ LOAD XONG
        // Đợi thêm 200ms để đảm bảo marker đã ổn định
        setTimeout(() => {
          if (onLocationChange) {
            onLocationChange(lat, lng);
          }
          // Reset flag sau khi đã update xong
          setTimeout(() => {
            isUserClickRef.current = false;
          }, 1000);
        }, 200);
      } else {
        // Nếu không có data, vẫn reset flag sau 2 giây
        setTimeout(() => {
          isUserClickRef.current = false;
        }, 2000);
      }
    }).catch((err) => {
      if (import.meta.env.DEV) {
        console.warn('Error fetching weather/geocode:', err);
      }
      // Reset flag nếu có lỗi
      setTimeout(() => {
        isUserClickRef.current = false;
      }, 2000);
    });
    
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: mapRef.current.getZoom() || 9,
        duration: 400,
        essential: true
      });
    }
  };

  const handlePreviewCardClick = () => {
    if (previewData) {
      if (setPage) {
        setPage(0);
      }
    }
  };


  return (
    <>
      <MapStyles />
      <section 
        data-map-container
        className="h-full flex flex-col relative" 
        style={{ 
          pointerEvents: 'auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          section::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <MapHeader
          setPage={setPage}
          openDetail={openDetail}
          openSettings={openSettings}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          currentTheme={currentTheme}
          primaryText={primaryText}
        />

        <MapSearchSection
          handleSearch={handleSearch}
          currentTheme={currentTheme}
          primaryText={primaryText}
          currentLocation={currentLocation}
          error={error}
        />

        <MapContainer
          mapCenter={mapCenter}
          markerPosition={markerPosition}
          locationName={locationName}
          handleMapClick={handleMapClick}
          handleMarkerClick={handleMarkerClick}
          markerTemperature={markerTemperature}
          mapRef={mapRef}
          primaryText={primaryText}
          shouldRenderMap={shouldRenderMap}
          heatmapEnabled={heatmapEnabled}
          heatmapPoints={heatmapPoints}
          heatmapLoading={heatmapLoading}
          isDark={isDark}
        />
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10000, pointerEvents: 'none' }}>
          <MapPreviewCard
            previewData={previewData}
            handlePreviewCardClick={handlePreviewCardClick}
            currentTheme={currentTheme}
            primaryText={primaryText}
          />
        </div>

        <MapCurrentLocation
          locationName={locationName}
          currentTheme={currentTheme}
          primaryText={primaryText}
        />
      </section>
    </>
  );
}
