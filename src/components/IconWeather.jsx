import React, { memo } from 'react';

import IconSunnyUrl from '../assets/icon/IconSunny.svg';
import IconPartlyCloudyUrl from '../assets/icon/IconPartlyCloudy.svg';
import IconOvercastUrl from '../assets/icon/IconOvercast.svg';
import IconRainUrl from '../assets/icon/IconRain.svg';
import IconThunderstormUrl from '../assets/icon/IconThunderstorm.svg';

const IconWeather = memo(function IconWeather({ 
  code,
  size,
  motionEnabled
}) {
  
  const iconStyle = {
    width: size || 128,
    height: size || 128,
    opacity: 1,
    display: 'block',
  };

  const containerClassName = motionEnabled ? 'animate-float' : '';

  let iconSrc;
  switch (code) {
    case 0:
      iconSrc = IconSunnyUrl;
      break;
    case 1:
      iconSrc = IconPartlyCloudyUrl;
      break;
    case 2:
      iconSrc = IconOvercastUrl;
      break;
    case 3:
      iconSrc = IconRainUrl;
      break;
    case 4:
      iconSrc = IconThunderstormUrl;
      break;
    default:
      iconSrc = IconPartlyCloudyUrl;
  }

  return (
    <div 
      style={{ width: size || 128, height: size || 128, display: 'inline-block' }}
      className={containerClassName}
    >
      <img 
        src={iconSrc} 
        alt="Weather icon"
        style={iconStyle}
      />
    </div>
  );
});

export default IconWeather;