import React from 'react';
import { Search } from 'lucide-react';
import { METRICS_COLORED_SHADOW } from '../../constants/styles';


export default function SearchInput({
  query,
  handleInputChange,
  handleSearch,
  setShowSuggestions,
  primaryText,
  currentTheme = {},
}) {
  // Determine if dark mode
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  const inputStyle = {
    width: '100%',
    height: 'clamp(44px, 6vh, 48px)',
    lineHeight: 'clamp(22px, 3vh, 24px)',
    padding: `0 clamp(0.75rem, 3vw, 1rem)`,
    paddingLeft: 'clamp(2.5rem, 7vw, 2.75rem)',
    border: isDarkMode ? `1px solid ${currentTheme.border || 'rgba(255, 255, 255, 0.15)'}` : 'none',
    borderRadius: '1.5rem',
    outline: 'none',
    backgroundColor: currentTheme.cardBgStrong || currentTheme.cardBg || 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: primaryText || '#0d0c22',
    transition: 'all 0.3s ease',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    boxShadow: `
      ${METRICS_COLORED_SHADOW},
      ${isDarkMode ? `
        inset 3px 3px 6px rgba(255, 255, 255, 0.15),
        inset -3px -3px 6px rgba(100, 181, 246, 0.2)
      ` : `
        inset 3px 3px 6px rgba(255, 255, 255, 0.5),
        inset -3px -3px 6px rgba(30, 144, 255, 0.2)
      `}
    `,
  };

  return (
    <>
      <div className="group" style={{ 
        display: 'flex',
        lineHeight: '28px',
        alignItems: 'center',
        position: 'relative',
        maxWidth: '100%',
        width: '100%'
      }}>
        <Search 
          className="icon" 
          style={{
            position: 'absolute',
            left: 'clamp(0.75rem, 2.5vw, 1rem)',
            fill: primaryText,
            width: 'clamp(0.875rem, 2.5vw, 1rem)',
            height: 'clamp(0.875rem, 2.5vw, 1rem)',
            color: primaryText,
            zIndex: 1,
            opacity: 0.7
          }}
        />
        <input
          className="input"
          type="text"
          placeholder="Tìm kiếm thành phố..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch(query);
            }
          }}
          style={inputStyle}
        />
      </div>
      <style>{`
        .input::placeholder {
          color: ${isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#9e9ea7'};
          opacity: 0.7;
        }
        .input:focus {
          outline: none;
          background-color: ${isDarkMode ? (currentTheme.cardBgStrong || 'rgba(30, 30, 50, 0.5)') : 'rgba(255, 255, 255, 0.95)'};
          box-shadow: 
            ${isDarkMode ? `
              0px 8px 20px rgba(100, 181, 246, 0.3),
              0px 3px 10px rgba(100, 181, 246, 0.25),
              inset 3px 3px 6px rgba(255, 255, 255, 0.2),
              inset -3px -3px 6px rgba(100, 181, 246, 0.25),
              0 0 0 3px rgba(100, 181, 246, 0.1);
            ` : `
              0px 8px 20px rgba(25, 118, 210, 0.35),
              0px 3px 10px rgba(25, 118, 210, 0.3),
              inset 3px 3px 6px rgba(255, 255, 255, 0.6),
              inset -3px -3px 6px rgba(30, 144, 255, 0.25),
              0 0 0 3px rgba(21, 101, 192, 0.1);
            `}
        }
        .input:hover {
          outline: none;
          background-color: ${isDarkMode ? (currentTheme.cardBgStrong || 'rgba(30, 30, 50, 0.45)') : 'rgba(255, 255, 255, 0.9)'};
          box-shadow: 
            ${isDarkMode ? `
              0px 8px 20px rgba(100, 181, 246, 0.25),
              0px 3px 10px rgba(100, 181, 246, 0.2),
              inset 3px 3px 6px rgba(255, 255, 255, 0.18),
              inset -3px -3px 6px rgba(100, 181, 246, 0.22);
            ` : `
              0px 8px 20px rgba(25, 118, 210, 0.3),
              0px 3px 10px rgba(25, 118, 210, 0.25),
              inset 3px 3px 6px rgba(255, 255, 255, 0.55),
              inset -3px -3px 6px rgba(30, 144, 255, 0.22);
            `}
        }
      `}</style>
    </>
  );
}
