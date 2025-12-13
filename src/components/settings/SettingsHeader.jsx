import React from 'react';
import { X } from 'lucide-react';


export default function SettingsHeader({
  setIsDrawerOpen,
  currentTheme = {},
  primaryText = '#1565c0',
}) {
  // Determine if dark mode
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  return (
    <div 
      className="flex items-center justify-between p-6 border-b" 
      style={{ 
        borderColor: currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(58, 141, 255, 0.15)')
      }}
    >
      <h2 
        className="text-2xl font-bold" 
        style={{ 
          color: primaryText,
          fontFamily: 'Open Sans, sans-serif'
        }}
      >
        Cài đặt
      </h2>
      <button 
        onClick={() => setIsDrawerOpen(false)}
        className="p-2 rounded-full transition-all active:scale-95"
        style={{
          background: isDarkMode 
            ? (currentTheme.cardBg || 'rgba(30, 30, 50, 0.4)') 
            : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
          boxShadow: isDarkMode 
            ? '0px 4px 12px rgba(100, 181, 246, 0.15)' 
            : '0px 4px 12px rgba(58, 141, 255, 0.2)',
        }}
        aria-label="Đóng cài đặt"
      >
        <X size={22} color={primaryText} />
      </button>
    </div>
  );
}
