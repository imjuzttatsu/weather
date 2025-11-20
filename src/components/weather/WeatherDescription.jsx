import React from 'react';
import { translateWeatherDesc } from '../../utils/weather';
import { WEATHER_DESC_MAP } from '../../constants/weather';

export default function WeatherDescription({ 
  condition, 
  shouldBreakLine = false,
  style = {},
  showPressure = false,
  pressure = null
}) {
  const translatedDesc = translateWeatherDesc(condition, WEATHER_DESC_MAP);
  
  if (!translatedDesc) return null;
  
  const pressureText = showPressure && pressure 
    ? ` • ${pressure} hPa`
    : '';
  
  const fullDescription = translatedDesc + pressureText;
  
  if (shouldBreakLine) {
    const words = translatedDesc.split(' ');
    const hasShortWord = words.some(word => word.length < 4);
    const shouldBreak = words.length > 1 && words.length >= 4 && !hasShortWord;
    
    if (shouldBreak) {
      return (
        <div style={style}>
          {words[0]}
          <br />
          {words.slice(1).join(' ')}
          {pressureText}
        </div>
      );
    }
  }
  
  return (
    <div style={style}>
      {fullDescription}
    </div>
  );
}

