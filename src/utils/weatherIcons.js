/**
 * Mapping WMO Weather Codes → Icon Files
 * Sử dụng bảng tra cứu WMO chuẩn quốc tế
 */

import { getWeatherFromWMO, WMO_CODE_TABLE } from './wmoCodeTable';

/**
 * Map WMO weather code sang icon file name
 * @param {number} wmoCode - WMO weather code (0-99)
 * @param {boolean|Date} isDay - true nếu ban ngày, hoặc Date object để tự tính
 * @param {object} options - { lat, lon, windSpeed, aqi, previousCode }
 * @returns {string} Icon file name (ví dụ: 'clear_day.svg')
 */
export function getIconForWeatherCode(wmoCode, isDay = true, options = {}) {
  // Xác định day/night
  let isDayTime = true;
  if (isDay === false) {
    isDayTime = false;
  } else if (isDay instanceof Date) {
    const hour = isDay.getHours();
    isDayTime = hour >= 6 && hour < 18;
  } else if (isDay === true) {
    isDayTime = true;
  } else {
    // Tự động xác định
    const now = new Date();
    const hour = now.getHours();
    isDayTime = hour >= 6 && hour < 18;
  }
  
  const weatherInfo = getWeatherFromWMO(wmoCode, isDayTime, options);
  return weatherInfo.icon;
}

/**
 * Map WMO code sang tên hiển thị tiếng Việt
 */
export function getVietnameseName(wmoCode) {
  const weather = WMO_CODE_TABLE[wmoCode];
  return weather?.vi || 'Không xác định';
}

/**
 * Lấy thông tin đầy đủ từ WMO code
 */
export function getWeatherInfo(wmoCode, isDay = true, options = {}) {
  let isDayTime = true;
  if (isDay === false) {
    isDayTime = false;
  } else if (isDay instanceof Date) {
    const hour = isDay.getHours();
    isDayTime = hour >= 6 && hour < 18;
  } else if (isDay === true) {
    isDayTime = true;
  } else {
    const now = new Date();
    const hour = now.getHours();
    isDayTime = hour >= 6 && hour < 18;
  }
  
  return getWeatherFromWMO(wmoCode, isDayTime, options);
}

// Export WMO_TO_VIETNAMESE để backward compatible
export const WMO_TO_VIETNAMESE = Object.fromEntries(
  Object.entries(WMO_CODE_TABLE).map(([code, info]) => [parseInt(code), info.vi])
);

