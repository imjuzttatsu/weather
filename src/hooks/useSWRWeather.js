import { useState, useRef, useEffect } from 'react';
import { weatherAPI } from '../utils/api';
import { extractCityName, transformDailyForecast, transformHourlyForecast } from '../utils/weatherHelpers';

const STALE_TIME = 10 * 60 * 1000;
const CACHE_TIMEOUT = 2 * 60 * 60 * 1000;
const POLLING_INTERVAL_ACTIVE = 10 * 60 * 1000;
const POLLING_INTERVAL_IDLE = 30 * 60 * 1000;
const MIN_FOCUS_REFRESH_INTERVAL = 30 * 1000;
const INACTIVITY_THRESHOLD = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 5;

const getConnectionType = () => {
  if ('connection' in navigator) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: conn?.effectiveType || '4g',
      saveData: conn?.saveData || false,
      downlink: conn?.downlink || 10
    };
  }
  return { effectiveType: '4g', saveData: false, downlink: 10 };
};

export function useSWRWeather() {
  const [weather, setWeather] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const weatherCache = useRef(new Map());
  const currentLocationRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastFocusRefreshRef = useRef(0);
  const isMountedRef = useRef(true);
  const lastActivityRef = useRef(Date.now());
  const isActiveRef = useRef(true);

  const getCacheAge = (timestamp) => Date.now() - timestamp;

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  const cleanupCache = () => {
    if (weatherCache.current.size > MAX_CACHE_ENTRIES) {
      const entries = Array.from(weatherCache.current.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
      toDelete.forEach(([key]) => weatherCache.current.delete(key));
    }
  };

  const getAdaptivePollingInterval = () => {
    if (document.hidden) return null;
    
    const { effectiveType, saveData } = getConnectionType();
    
    if (saveData) {
      return 60 * 60 * 1000;
    }
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 30 * 60 * 1000;
    }
    
    return isActiveRef.current ? POLLING_INTERVAL_ACTIVE : POLLING_INTERVAL_IDLE;
  };

  const fetchWeatherData = async (city = null, lat = null, lon = null, options = {}) => {
    const { 
      forceRefresh = false, 
      preserveCity = false,
      silent = false 
    } = options;

    const existingCity = preserveCity && currentLocationRef.current?.city 
      ? currentLocationRef.current.city 
      : city;
    const cacheKey = existingCity || `${lat},${lon}`;
    const cached = weatherCache.current.get(cacheKey);
    const cacheAge = cached ? getCacheAge(cached.timestamp) : Infinity;

    if (!forceRefresh && cached && cacheAge < STALE_TIME) {
      if (!silent) {
        setIsLoading(false);
      }
      
      const cachedWeather = { ...cached.data.weather };
      if (cachedWeather.location) {
        cachedWeather.location = extractCityName(cachedWeather.location);
      }
      const cachedLocation = { ...cached.data.currentLocation };
      if (cachedLocation.city) {
        cachedLocation.city = extractCityName(cachedLocation.city);
      }
      
      setWeather(cachedWeather);
      setDailyForecast(cached.data.dailyForecast);
      setHourlyForecast(cached.data.hourlyForecast);
      setCurrentLocation(cachedLocation);
      setLastUpdated(cached.timestamp);
      currentLocationRef.current = cachedLocation;
      return;
    }

    if (!forceRefresh && cached && cacheAge >= STALE_TIME && cacheAge < CACHE_TIMEOUT) {
      const cachedWeather = { ...cached.data.weather };
      if (cachedWeather.location) {
        cachedWeather.location = extractCityName(cachedWeather.location);
      }
      const cachedLocation = { ...cached.data.currentLocation };
      if (cachedLocation.city) {
        cachedLocation.city = extractCityName(cachedLocation.city);
      }

      setWeather(cachedWeather);
      setDailyForecast(cached.data.dailyForecast);
      setHourlyForecast(cached.data.hourlyForecast);
      setCurrentLocation(cachedLocation);
      setLastUpdated(cached.timestamp);
      currentLocationRef.current = cachedLocation;
      
      if (!silent) {
        setIsLoading(false);
        setIsRefreshing(true);
      }

      try {
        await fetchWeatherData(existingCity, lat, lon, { forceRefresh: true, preserveCity, silent: true });
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('[SWR] Background refresh failed:', err);
        }
      } finally {
        if (!silent) {
          setIsRefreshing(false);
        }
      }
      return;
    }

    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [currentData, forecastData, hourlyData] = await Promise.all([
        weatherAPI.getCurrentWeather(existingCity, lat, lon),
        weatherAPI.getForecast(existingCity, lat, lon, 16),
        weatherAPI.getHourlyForecast(existingCity, lat, lon, 8)
      ]);

      const mainRawWeatherCode = currentData.weather.weatherCode;

      let cityName = preserveCity && currentLocationRef.current?.city 
        ? currentLocationRef.current.city 
        : currentData.location.city;

      cityName = extractCityName(cityName);

      let humidity = currentData.weather.humidity;
      if (humidity == null || humidity === undefined || isNaN(humidity)) {
        humidity = forecastData.forecast?.[0]?.humidity;
        if (humidity == null || humidity === undefined || isNaN(humidity)) {
          humidity = 65;
        }
      }
      humidity = Math.round(Number(humidity));
      humidity = Math.max(0, Math.min(100, humidity));

      const newWeather = {
        temperature: currentData.weather.temperature,
        condition: currentData.weather.condition,
        location: cityName,
        humidity: humidity,
        windSpeed: currentData.weather.windSpeed,
        weatherCode: mainRawWeatherCode,
        updatedAt: currentData.timestamp,
        tempMax: forecastData.forecast[0]?.tempMax || 24,
        tempMin: forecastData.forecast[0]?.tempMin || 18,
        rainChance: currentData.weather.precipitation || 10,
        pressure: currentData.weather.pressure || 1012,
        visibility: 10
      };

      let locationCity = preserveCity && currentLocationRef.current?.city 
        ? currentLocationRef.current.city 
        : currentData.location.city;

      locationCity = extractCityName(locationCity);

      const newLocation = {
        lat: currentData.location.lat,
        lon: currentData.location.lon,
        city: locationCity,
        detailedAddress: currentData.location.detailedAddress || currentData.location.city
      };

      const updatedDailyForecast = transformDailyForecast(forecastData.forecast);
      
      if (import.meta.env.DEV) {
        console.log('[SWR] hourlyData response:', hourlyData);
        console.log('[SWR] hourlyData.hourly:', hourlyData.hourly);
        console.log('[SWR] hourlyData.hourly length:', hourlyData.hourly?.length);
      }
      
      const updatedHourlyForecast = transformHourlyForecast(
        hourlyData.hourly, 
        8, 
        currentData.weather.temperature, 
        mainRawWeatherCode,
        {
          condition: currentData.weather.condition,
          windSpeed: currentData.weather.windSpeed,
          humidity: humidity,
          rainChance: currentData.weather.precipitation || 10
        }
      );
      
      if (import.meta.env.DEV) {
        console.log('[SWR] updatedHourlyForecast length:', updatedHourlyForecast.length);
      }

      setWeather(newWeather);
      setCurrentLocation(newLocation);
      currentLocationRef.current = newLocation;
      setDailyForecast(updatedDailyForecast);
      setHourlyForecast(updatedHourlyForecast);
      setLastUpdated(Date.now());

      weatherCache.current.set(cacheKey, {
        data: {
          weather: newWeather,
          dailyForecast: updatedDailyForecast,
          hourlyForecast: updatedHourlyForecast,
          currentLocation: newLocation
        },
        timestamp: Date.now()
      });

      cleanupCache();

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[SWR] Fetch error:', error);
      }
      
      if (cached && cacheAge < CACHE_TIMEOUT) {
        const cachedWeather = { ...cached.data.weather };
        if (cachedWeather.location) {
          cachedWeather.location = extractCityName(cachedWeather.location);
        }
        const cachedLocation = { ...cached.data.currentLocation };
        if (cachedLocation.city) {
          cachedLocation.city = extractCityName(cachedLocation.city);
        }
        
        setWeather(cachedWeather);
        setDailyForecast(cached.data.dailyForecast);
        setHourlyForecast(cached.data.hourlyForecast);
        setCurrentLocation(cachedLocation);
        setLastUpdated(cached.timestamp);
      }
      throw error;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      isActiveRef.current = true;
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    const inactivityCheck = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      isActiveRef.current = timeSinceActivity < INACTIVITY_THRESHOLD;
    }, 2 * 60 * 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, []);

  useEffect(() => {
    if (!currentLocation || !isMountedRef.current) return;

    const startPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      const poll = () => {
        const interval = getAdaptivePollingInterval();
        if (!interval || !currentLocation) return;

        fetchWeatherData(
          currentLocation.city,
          currentLocation.lat,
          currentLocation.lon,
          { preserveCity: true, silent: true }
        ).catch(err => {
          if (import.meta.env.DEV) {
            console.error('[SWR] Polling error:', err);
          }
        });
      };

      const interval = getAdaptivePollingInterval();
      if (interval) {
        poll();
        pollingIntervalRef.current = setInterval(poll, interval);
      }
    };

    startPolling();

    const activityCheck = setInterval(() => {
      const currentInterval = getAdaptivePollingInterval();
      if (currentInterval) {
        startPolling();
      }
    }, 2 * 60 * 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      clearInterval(activityCheck);
    };
  }, [currentLocation]);

  useEffect(() => {
    if (!currentLocation) return;

    const handleFocus = () => {
      if (!document.hidden && currentLocation) {
        const now = Date.now();
        const timeSinceLastFocusRefresh = now - lastFocusRefreshRef.current;

        if (timeSinceLastFocusRefresh < MIN_FOCUS_REFRESH_INTERVAL) {
          return;
        }

        const cached = weatherCache.current.get(currentLocation.city || `${currentLocation.lat},${currentLocation.lon}`);
        const cacheAge = cached ? getCacheAge(cached.timestamp) : Infinity;

        if (cacheAge >= STALE_TIME) {
          lastFocusRefreshRef.current = now;
          fetchWeatherData(
            currentLocation.city,
            currentLocation.lat,
            currentLocation.lon,
            { preserveCity: true, silent: true }
          ).catch(err => {
            if (import.meta.env.DEV) {
              console.error('[SWR] Focus refetch error:', err);
            }
          });
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [currentLocation]);

  useEffect(() => {
    const handleOnline = () => {
      if (currentLocation) {
        fetchWeatherData(
          currentLocation.city,
          currentLocation.lat,
          currentLocation.lon,
          { preserveCity: true, silent: true }
        ).catch(err => {
          if (import.meta.env.DEV) {
            console.error('[SWR] Network reconnect error:', err);
          }
        });
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [currentLocation]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      cleanupCache();
      const now = Date.now();
      weatherCache.current.forEach((value, key) => {
        if (now - value.timestamp > 60 * 60 * 1000) {
          weatherCache.current.delete(key);
        }
      });
    }, 10 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
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
  };
}
