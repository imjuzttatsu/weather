// Không cần mapWeatherCodeToIcon nữa, truyền WMO code trực tiếp
import { DAY_NAMES } from '../constants/weather';

export const extractCityName = (locationString) => {
  if (!locationString) return '';
  if (locationString.includes(',')) {
    const parts = locationString.split(',').map(s => s.trim());
    return parts[parts.length - 1] || locationString;
  }
  return locationString;
};

export const transformDailyForecast = (forecastData) => {
  if (!forecastData || !Array.isArray(forecastData)) return [];
  
  return forecastData.map((day, index) => {
    const date = new Date(day.date);
    const dayName = index === 0 ? 'Hôm nay' : DAY_NAMES[date.getDay()];
    
    return {
      day: dayName,
      temp: day.tempMax,
      tempMin: day.tempMin,
      icon: day.weatherCode, // WMO code trực tiếp
      desc: day.condition,
      weatherCode: day.weatherCode,
      windSpeed: day.windSpeed,
      precipitationProbability: day.precipitationProbability,
      humidity: (day.humidity != null && day.humidity !== undefined && !isNaN(day.humidity)) 
        ? Math.round(Math.max(0, Math.min(100, Number(day.humidity)))) 
        : 65,
      pressure: day.pressure || 1013,
      tempMax: day.tempMax,
      rainChance: day.precipitationProbability
    };
  });
};

export const transformHourlyForecast = (hourlyData, limit = 8, currentTemperature = null, currentWeatherCode = null, currentWeatherData = null) => {
  if (!hourlyData || !Array.isArray(hourlyData)) {
    if (import.meta.env.DEV) {
      console.warn('[TRANSFORM] hourlyData is not an array:', hourlyData);
    }
    return [];
  }
  
  if (import.meta.env.DEV) {
    console.log('[TRANSFORM] hourlyData length:', hourlyData.length);
    console.log('[TRANSFORM] First hour:', hourlyData[0]?.time);
    console.log('[TRANSFORM] Last hour:', hourlyData[hourlyData.length - 1]?.time);
  }
  
  const now = new Date();
  const currentTime = now.getTime();
  
  // Backend đã trả về đúng 8 giờ từ giờ hiện tại, chỉ cần lấy limit giờ đầu tiên
  const hoursToUse = hourlyData.slice(0, limit);
  
  if (import.meta.env.DEV) {
    console.log('[TRANSFORM] hoursToUse length:', hoursToUse.length);
  }
  
  return hoursToUse.map((hour, index) => {
    // SỬA: Dùng thời gian thực tế từ API thay vì tính từ now + index
    const hourTime = new Date(hour.time).getTime();
    // Xác định "Now" dựa trên thời gian thực tế (trong vòng 30 phút)
    const isNow = Math.abs(hourTime - currentTime) <= 30 * 60 * 1000;
    
    let displayTime;
    let timeDateForDisplay;
    
    // SỬA: Dùng thời gian thực tế từ API
    timeDateForDisplay = new Date(hour.time);
    
    if (isNow) {
      displayTime = 'Now';
    } else {
      displayTime = timeDateForDisplay.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Bangkok'
      });
    }
    
    // Thẻ "Now" dùng data hiện tại nếu có, các thẻ khác dùng data từ API
    const temp = isNow && currentTemperature !== null ? currentTemperature : hour.temperature;
    const weatherCode = isNow && currentWeatherCode !== null ? currentWeatherCode : hour.weatherCode;
    
    // SỬA: Process humidity từ API (có thể null hoặc số)
    let humidity = null;
    if (isNow && currentWeatherData?.humidity !== null && currentWeatherData?.humidity !== undefined) {
      humidity = currentWeatherData.humidity;
    } else if (hour.humidity != null && hour.humidity !== undefined) {
      humidity = Math.round(Math.max(0, Math.min(100, Number(hour.humidity))));
    }

    return {
      time: displayTime,
      timeDate: timeDateForDisplay, // Dùng thời gian thực tế từ API
      temp: temp,
      icon: weatherCode,
      weatherCode: weatherCode,
      condition: isNow && currentWeatherData?.condition ? currentWeatherData.condition : (hour.condition || null),
      windSpeed: isNow && currentWeatherData?.windSpeed !== null ? currentWeatherData.windSpeed : (hour.windSpeed || null),
      humidity: humidity,
      precipitation: hour.precipitation != null ? hour.precipitation : null,
      rainChance: isNow && currentWeatherData?.rainChance !== null ? currentWeatherData.rainChance : (hour.precipitationProbability != null ? hour.precipitationProbability : null)
    };
  });
};
