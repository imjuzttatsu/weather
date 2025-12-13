import React from 'react';


export default function SettingsThemeSection({
  themeMode,
  setThemeMode,
  isDark,
  setIsDark,
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
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => {
            setThemeMode('manual');
            setIsDark(false);
          }} 
          className={`py-4 text-sm rounded-xl transition-all active:scale-95 ${
            !isDark ? 'font-bold' : 'font-medium'
          }`}
          style={{
            fontFamily: 'Open Sans, sans-serif',
            background: !isDark
              ? newBlueGradient 
              : (isDarkMode ? (currentTheme.cardBg || 'rgba(30, 30, 50, 0.4)') : 'rgba(255, 255, 255, 0.5)'),
            color: !isDark ? '#fff' : primaryText,
            backdropFilter: 'blur(10px)',
            border: !isDark
              ? 'none' 
              : `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
            boxShadow: !isDark
              ? newBlueShadow
              : (isDarkMode 
                ? '0px 4px 12px rgba(100, 181, 246, 0.15)' 
                : '0px 4px 12px rgba(0, 0, 0, 0.08)'),
          }}
        >
          ☀️ Sáng
        </button>
        <button 
          onClick={() => {
            setThemeMode('manual');
            setIsDark(true);
          }} 
          className={`py-4 text-sm rounded-xl transition-all active:scale-95 ${
            themeMode === 'manual' && isDark ? 'font-bold' : 'font-medium'
          }`}
          style={{
            fontFamily: 'Open Sans, sans-serif',
            background: themeMode === 'manual' && isDark 
              ? newBlueGradient 
              : (isDarkMode ? (currentTheme.cardBg || 'rgba(30, 30, 50, 0.4)') : 'rgba(255, 255, 255, 0.5)'),
            color: themeMode === 'manual' && isDark ? '#fff' : primaryText,
            backdropFilter: 'blur(10px)',
            border: themeMode === 'manual' && isDark 
              ? 'none' 
              : `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
            boxShadow: themeMode === 'manual' && isDark
              ? newBlueShadow
              : (isDarkMode 
                ? '0px 4px 12px rgba(100, 181, 246, 0.15)' 
                : '0px 4px 12px rgba(0, 0, 0, 0.08)'),
          }}
        >
          🌙 Tối
        </button>
      </div>
    </div>
  );
}
