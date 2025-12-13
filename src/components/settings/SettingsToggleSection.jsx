import React from 'react';
import ToggleSwitch from '../UI/Toggle3D';


export default function SettingsToggleSection({
  title,
  description,
  checked,
  onChange,
  primaryText,
  secondaryText,
  currentTheme = {},
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span 
          className="text-base font-semibold block mb-1" 
          style={{ 
            color: primaryText,
            fontFamily: 'Open Sans, sans-serif'
          }}
        >
          {title}
        </span>
        <span 
          className="text-sm" 
          style={{ 
            color: secondaryText,
            fontFamily: 'Open Sans, sans-serif'
          }}
        >
          {description}
        </span>
      </div>
      <ToggleSwitch 
        checked={checked} 
        onChange={onChange}
        currentTheme={currentTheme}
      />
    </div>
  );
}
