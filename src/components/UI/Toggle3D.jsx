import React from 'react';

export default function ToggleSwitch({ checked, onChange, currentTheme = {} }) {
  // Determine if dark mode
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  // Light mode gradient
  const lightGradient = 'linear-gradient(180deg, #A1C4FD 0%, #3A8DFF 100%)';
  // Dark mode gradient
  const darkGradient = 'linear-gradient(180deg, #64B5F6 0%, #42A5F5 100%)';
  const toggleGradient = isDarkMode ? darkGradient : lightGradient;
  
  // Light mode shadows
  const lightOuterShadow = `
    -8px -4px 8px 0px rgba(255, 255, 255, 0.8),
    8px 4px 12px 0px rgba(58, 141, 255, 0.3),
    4px 4px 4px 0px rgba(58, 141, 255, 0.15) inset,
    -4px -4px 4px 0px rgba(255, 255, 255, 0.8) inset
  `;
  const lightInnerShadow = `
    -8px -4px 8px 0px rgba(255, 255, 255, 0.5),
    8px 4px 12px 0px rgba(58, 141, 255, 0.4)
  `;
  
  // Dark mode shadows
  const darkOuterShadow = `
    -8px -4px 8px 0px rgba(255, 255, 255, 0.15),
    8px 4px 12px 0px rgba(100, 181, 246, 0.2),
    4px 4px 4px 0px rgba(100, 181, 246, 0.1) inset,
    -4px -4px 4px 0px rgba(255, 255, 255, 0.1) inset
  `;
  const darkInnerShadow = `
    -8px -4px 8px 0px rgba(255, 255, 255, 0.1),
    8px 4px 12px 0px rgba(100, 181, 246, 0.25)
  `;
  
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div 
        className="relative"
        style={{
          width: '60px',
          height: '30px',
          borderRadius: '15px',
          overflow: 'hidden',
          background: isDarkMode 
            ? (currentTheme.cardBg || 'rgba(30, 30, 50, 0.4)') 
            : 'rgba(255, 255, 255, 0.5)',
          border: `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
          backdropFilter: 'blur(10px)',
          boxShadow: isDarkMode ? darkOuterShadow : lightOuterShadow,
          transition: 'all 0.3s ease',
        }}
      >
        <div 
          style={{
            height: '100%',
            width: '200%',
            background: toggleGradient,
            borderRadius: '15px',
            transform: checked ? 'translate3d(25%, 0, 0)' : 'translate3d(-75%, 0, 0)',
            transition: 'transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35)',
            boxShadow: isDarkMode ? darkInnerShadow : lightInnerShadow,
          }}
        />
      </div>
    </label>
  );
}