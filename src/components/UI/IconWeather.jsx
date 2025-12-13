import React, { memo, useMemo } from 'react';
import { getIconForWeatherCode } from '../../utils/weatherIcons';

// Import tất cả icon files một lần (Vite sẽ optimize)
const iconImports = import.meta.glob('../../assets/icon/*.svg', { eager: true, as: 'url' });

/**
 * IconWeather Component
 * Hiển thị icon thời tiết dựa trên WMO weather code
 * Giống Breezy Weather - tự động chọn day/night và intensity
 * 
 * Backward compatible: nhận cả icon code cũ (0-4) và WMO code (0-99)
 */
const IconWeather = memo(function IconWeather({ 
  code, // WMO weather code (0-99) hoặc icon code cũ (0-4) - backward compatible
  size = 128,
  motionEnabled = false,
  isDay = null, // true/false hoặc Date object, null = tự động
  lat = null, // Vĩ độ để tính day/night chính xác hơn
  lon = null, // Kinh độ để tính day/night chính xác hơn
  windSpeed = null, // Tốc độ gió (km/h) - nếu > 20 sẽ hiển thị windy.svg
  aqi = null, // Chỉ số chất lượng không khí - nếu > 150 sẽ hiển thị haze.svg
  previousCode = null, // WMO code trước đó - để hiển thị rainbow khi chuyển từ mưa sang clear
  ...props
}) {
  
  const iconStyle = {
    width: size,
    height: size,
    opacity: 1,
    display: 'block',
  };

  const containerClassName = motionEnabled ? 'animate-float' : '';

  // Xác định day/night nếu không được truyền vào
  const dayTime = useMemo(() => {
    if (isDay !== null) {
      if (isDay instanceof Date) {
        const hour = isDay.getHours();
        return hour >= 6 && hour < 18;
      }
      return isDay;
    }
    // Tự động xác định dựa trên giờ hiện tại
    const now = new Date();
    const hour = now.getHours();
    return hour >= 6 && hour < 18;
  }, [isDay]);

  // Luôn coi code là WMO code (0-99), không map backward compatibility nữa
  const wmoCode = useMemo(() => {
    if (code == null) return 2; // Default: partly cloudy
    // Luôn trả về code như WMO code
    return code;
  }, [code]);

  // Lấy icon file name từ WMO code
  const iconFileName = useMemo(() => {
    return getIconForWeatherCode(wmoCode, dayTime, { 
      lat, 
      lon, 
      windSpeed, 
      aqi, 
      previousCode 
    });
  }, [wmoCode, dayTime, lat, lon, windSpeed, aqi, previousCode]);
  
  // Lấy icon URL từ imports
  const iconSrc = useMemo(() => {
    const iconPath = `../../assets/icon/${iconFileName}`;
    const imported = iconImports[iconPath];
    
    if (imported) {
      return imported;
    }
    
    // Fallback nếu không tìm thấy
    if (import.meta.env.DEV) {
      console.warn(`[IconWeather] Icon not found: ${iconFileName}, using default`);
    }
    
    // Try default fallback
    const defaultPath = `../../assets/icon/partly_cloud_day.svg`;
    return iconImports[defaultPath] || '/src/assets/icon/partly_cloud_day.svg';
  }, [iconFileName]);

  return (
    <div 
      style={{ width: size, height: size, display: 'inline-block' }}
      className={containerClassName}
      {...props}
    >
      <img 
        src={iconSrc} 
        alt={`Weather icon: ${iconFileName}`}
        style={iconStyle}
        loading="lazy"
      />
    </div>
  );
});

export default IconWeather;
