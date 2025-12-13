/**
 * Helper functions để xác định day/night và các thông tin thời gian
 */

/**
 * Xác định xem có phải ban ngày không dựa trên giờ hiện tại
 * @param {Date} date - Ngày giờ cần kiểm tra (mặc định: hiện tại)
 * @param {number} sunriseHour - Giờ mặt trời mọc (mặc định: 6)
 * @param {number} sunsetHour - Giờ mặt trời lặn (mặc định: 18)
 * @returns {boolean} true nếu là ban ngày
 */
export function isDaytime(date = new Date(), sunriseHour = 6, sunsetHour = 18) {
  const hour = date.getHours();
  return hour >= sunriseHour && hour < sunsetHour;
}

/**
 * Lấy icon suffix (_day hoặc _night) dựa trên thời gian
 * @param {Date} date - Ngày giờ cần kiểm tra
 * @returns {string} '_day' hoặc '_night'
 */
export function getTimeSuffix(date = new Date()) {
  return isDaytime(date) ? '_day' : '_night';
}

/**
 * Tính sunrise/sunset dựa trên lat/lon (đơn giản hóa cho Việt Nam)
 * Có thể cải thiện bằng thư viện tính toán chính xác hơn
 * @param {number} lat - Vĩ độ
 * @param {number} lon - Kinh độ
 * @param {Date} date - Ngày cần tính
 * @returns {{sunrise: Date, sunset: Date}}
 */
export function getSunriseSunset(lat, lon, date = new Date()) {
  // Đơn giản hóa: Việt Nam (lat ~10-23, lon ~102-110)
  // Mùa hè: 5h30 - 18h30
  // Mùa đông: 6h - 17h30
  const month = date.getMonth(); // 0-11
  const isSummer = month >= 3 && month <= 8; // Tháng 4-9
  
  const sunriseHour = isSummer ? 5.5 : 6;
  const sunsetHour = isSummer ? 18.5 : 17.5;
  
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), (sunriseHour % 1) * 60, 0, 0);
  
  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetHour), (sunsetHour % 1) * 60, 0, 0);
  
  return { sunrise, sunset };
}

/**
 * Xác định day/night dựa trên lat/lon và thời gian chính xác hơn
 * @param {Date} date - Ngày giờ cần kiểm tra
 * @param {number} lat - Vĩ độ
 * @param {number} lon - Kinh độ
 * @returns {boolean} true nếu là ban ngày
 */
export function isDaytimeByLocation(date = new Date(), lat, lon) {
  if (lat == null || lon == null) {
    // Fallback về logic đơn giản nếu không có location
    return isDaytime(date);
  }
  
  const { sunrise, sunset } = getSunriseSunset(lat, lon, date);
  return date >= sunrise && date < sunset;
}

