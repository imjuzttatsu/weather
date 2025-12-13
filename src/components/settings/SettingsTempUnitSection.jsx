import React from 'react';


export default function SettingsTempUnitSection({
  tempUnit,
  setTempUnit,
  primaryText,
  currentTheme = {},
}) {
  // Determine if dark mode
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  // Light mode gradient
  const lightGradient = 'linear-gradient(180deg, #A1C4FD 0%, #3A8DFF 100%)';
  // Dark mode gradient
  const darkGradient = 'linear-gradient(180deg, #64B5F6 0%, #42A5F5 100%)';
  const newBlueGradient = isDarkMode ? darkGradient : lightGradient;
  
  // Light mode shadow
  const lightShadow = `
    0px 12px 30px rgba(58, 141, 255, 0.4),
    0px 4px 12px rgba(58, 141, 255, 0.25)
  `;
  // Dark mode shadow
  const darkShadow = `
    0px 12px 30px rgba(100, 181, 246, 0.3),
    0px 4px 12px rgba(100, 181, 246, 0.2)
  `;
  const newBlueShadow = isDarkMode ? darkShadow : lightShadow;

  return (
    <div>
      <h3 
        className="text-sm font-bold mb-3 uppercase tracking-wide" 
        style={{ 
          color: primaryText,
          fontFamily: 'Open Sans, sans-serif',
          letterSpacing: '1px'
        }}
      >
        Đơn vị nhiệt độ
      </h3>
      <div className="flex gap-3">
        <button 
          onClick={() => setTempUnit('C')} 
          className={`flex-1 py-3 rounded-xl transition-all active:scale-95 ${
            tempUnit === 'C' ? 'font-bold' : 'font-medium'
          }`}
          style={{
            fontFamily: 'Open Sans, sans-serif',
            background: tempUnit === 'C' 
              ? newBlueGradient 
              : (isDarkMode ? (currentTheme.cardBg || 'rgba(30, 30, 50, 0.4)') : 'rgba(255, 255, 255, 0.5)'),
            color: tempUnit === 'C' ? '#fff' : primaryText,
            backdropFilter: 'blur(10px)',
            border: tempUnit === 'C' 
              ? 'none' 
              : `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
            boxShadow: tempUnit === 'C'
              ? newBlueShadow
              : (isDarkMode 
                ? '0px 4px 12px rgba(100, 181, 246, 0.15)' 
                : '0px 4px 12px rgba(0, 0, 0, 0.08)'),
          }}
        >
          °C
        </button>
        <button 
          onClick={() => setTempUnit('F')} 
          className={`flex-1 py-3 rounded-xl transition-all active:scale-95 ${
            tempUnit === 'F' ? 'font-bold' : 'font-medium'
          }`}
          style={{
            fontFamily: 'Open Sans, sans-serif',
            background: tempUnit === 'F' 
              ? newBlueGradient 
              : (isDarkMode ? (currentTheme.cardBg || 'rgba(30, 30, 50, 0.4)') : 'rgba(255, 255, 255, 0.5)'),
            color: tempUnit === 'F' ? '#fff' : primaryText,
            backdropFilter: 'blur(10px)',
            border: tempUnit === 'F' 
              ? 'none' 
              : `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
            boxShadow: tempUnit === 'F'
              ? newBlueShadow
              : (isDarkMode 
                ? '0px 4px 12px rgba(100, 181, 246, 0.15)' 
                : '0px 4px 12px rgba(0, 0, 0, 0.08)'),
          }}
        >
          °F
        </button>
      </div>
    </div>
  );
}
