import React from 'react';
import HourlyIcon from '../icons/HourlyIcon';

export default function HourlyCard({ 
  time, 
  temp, 
  icon, 
  isActive, 
  isPreview, 
  onClick, 
  convertTemp,
  activeStyle,
  inactiveStyle 
}) {
  return (
    <button
      className="flex flex-col items-center flex-shrink-0 w-20 py-3 px-2 transition-all"
      style={isActive ? activeStyle : inactiveStyle}
      onClick={isPreview ? undefined : onClick}
      disabled={isPreview}
    >
      <div
        className="text-xs mb-2 font-medium"
        style={{ color: '#FFFFFF' }}
      >
        {time}
      </div>
      
      <HourlyIcon code={icon} color="#FFFFFF" />

      <div className="text-base font-bold mt-2" style={{ color: '#FFFFFF' }}>
        {convertTemp(temp)}°
      </div>
    </button>
  );
}

