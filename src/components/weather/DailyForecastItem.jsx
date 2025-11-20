import React from 'react';
import IconWeather from '../IconWeather';
import { translateWeatherDesc } from '../../utils/weather';
import { WEATHER_DESC_MAP } from '../../constants/weather';

export default function DailyForecastItem({ 
  day, 
  icon, 
  desc, 
  temp, 
  tempMin, 
  isSelected, 
  onClick, 
  convertTemp,
  style = {}
}) {
  const translatedDesc = translateWeatherDesc(desc, WEATHER_DESC_MAP);
  
  const defaultStyle = {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    opacity: isSelected ? 1 : 0.8,
    ...style
  };

  return (
    <button
      className="flex items-center w-full transition-all active:scale-95"
      style={defaultStyle}
      onClick={onClick}
    >
      <div 
        className="text-base font-medium" 
        style={{ 
          color: '#666', 
          opacity: 0.8, 
          width: '90px', 
          marginLeft: '0', 
          flexShrink: 0, 
          textAlign: 'left' 
        }}
      >
        {day}
      </div>
      
      <div 
        style={{ 
          opacity: 1, // Đảm bảo icon không bị mờ
          width: '48px', 
          height: '48px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0, 
          marginLeft: '0.75rem' 
        }}
      >
        <IconWeather
          code={icon}
          motionEnabled={false}
          size={40}
        />
      </div>

      <div 
        className="flex-1 text-base" 
        style={{ 
          color: '#666', 
          opacity: 0.8, 
          whiteSpace: 'nowrap', 
          marginLeft: '0.75rem', 
          marginRight: '0.75rem', 
          minWidth: 0 
        }}
      >
        {translatedDesc}
      </div>

      <div 
        className="text-base font-medium" 
        style={{ 
          color: '#666', 
          opacity: 0.8, 
          width: '85px', 
          textAlign: 'right', 
          marginRight: '0.5rem', 
          flexShrink: 0 
        }}
      >
        {convertTemp(temp)} / {convertTemp(tempMin)}
      </div>
    </button>
  );
}

