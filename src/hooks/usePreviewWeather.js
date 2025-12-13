import { useState } from 'react';
import { weatherAPI } from '../utils/api';
import { extractCityName, transformDailyForecast, transformHourlyForecast } from '../utils/weatherHelpers';
import { useToast } from '../components/UI/Toast';


export function usePreviewWeather() {
  const [preview, setPreview] = useState({
    location: null,
    weather: null,
    hourlyForecast: [],
    dailyForecast: [],
  });
  const [previewLoading, setPreviewLoading] = useState(false);
  const toast = useToast();

  const fetchPreviewWeather = async (lat, lon, cityName) => {
    setPreviewLoading(true);
    try {
      const currentData = await weatherAPI.getCurrentWeather(null, lat, lon);
      const forecastData = await weatherAPI.getForecast(null, lat, lon, 8);
      const hourlyData = await weatherAPI.getHourlyForecast(null, lat, lon, 8);

      const rawWeatherCode = currentData.weather.weatherCode;
      
      const updatedDailyForecast = transformDailyForecast(forecastData.forecast);
      const humidity = (currentData.weather.humidity != null && currentData.weather.humidity !== undefined && !isNaN(currentData.weather.humidity))
        ? Math.round(Math.max(0, Math.min(100, Number(currentData.weather.humidity))))
        : 65;
      const updatedHourlyForecast = transformHourlyForecast(
        hourlyData.hourly, 
        8, 
        currentData.weather.temperature, 
        rawWeatherCode,
        {
          condition: currentData.weather.condition,
          windSpeed: currentData.weather.windSpeed,
          humidity: humidity,
          rainChance: currentData.weather.precipitation || 10
        }
      );
      if (import.meta.env.DEV) {
        console.log(`[PREVIEW] Location: ${cityName}, WMO weatherCode: ${rawWeatherCode}, Condition: ${currentData.weather.condition}`);
      }


      const previewCityName = cityName || currentData.location.city;
      const extractedCity = extractCityName(previewCityName);

      setPreview({
        location: { lat, lon, city: extractedCity },
        weather: {
          temperature: currentData.weather.temperature,
          condition: currentData.weather.condition,
          location: extractedCity,
          humidity: (currentData.weather.humidity != null && currentData.weather.humidity !== undefined && !isNaN(currentData.weather.humidity))
            ? Math.round(Math.max(0, Math.min(100, Number(currentData.weather.humidity))))
            : 65,
          windSpeed: currentData.weather.windSpeed,
          weatherCode: rawWeatherCode,
          tempMax: forecastData.forecast[0]?.tempMax || currentData.weather.temperature,
          tempMin: forecastData.forecast[0]?.tempMin || currentData.weather.temperature,
          rainChance: currentData.weather.precipitation || 10,
          pressure: currentData.weather.pressure || 1012,
        },
        hourlyForecast: updatedHourlyForecast,
        dailyForecast: updatedDailyForecast,
      });
      
      return true; 
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`[PREVIEW] Error fetching weather for ${cityName}:`, error);
        if (error.response) {
          console.error(`[PREVIEW] Response status: ${error.response.status}`);
          console.error(`[PREVIEW] Response data:`, error.response.data);
        }
      }
      if (error.response) {
        if (error.response.status === 429) {
          toast.error('Quá nhiều requests. Vui lòng đợi một chút rồi thử lại.');
        } else if (error.response.status === 404) {
          toast.error('Không tìm thấy địa điểm. Vui lòng thử lại.');
        }
      }
      setPreview(prev => ({ ...prev, weather: null }));
      return false; 
    } finally {
      setPreviewLoading(false);
    }
  };

  return {
    preview,
    previewLoading,
    fetchPreviewWeather
  };
}
