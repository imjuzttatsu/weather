import React from 'react';
import { METRICS_COLORED_SHADOW } from '../../constants/styles';


export default function SearchSuggestions({
  displaySuggestions,
  handleSuggestionClick,
  query,
  recentSearches,
  nearbyLocations,
  primaryText,
}) {
  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    boxShadow: `
      ${METRICS_COLORED_SHADOW},
      inset 2px 2px 4px rgba(255, 255, 255, 0.5),
      inset -2px -2px 4px rgba(30, 144, 255, 0.15)
    `,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  if (displaySuggestions.length === 0) return null;

  return (
    <div style={dropdownStyle}>
      {query.trim().length === 0 && recentSearches.length > 0 && (
        <div style={{ 
          padding: '0.75rem 1.25rem', 
          fontSize: '0.7rem', 
          color: '#1565c0', 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.8
        }}>
          Đã tìm kiếm gần đây
        </div>
      )}
      {query.trim().length === 0 && nearbyLocations.length > 0 && recentSearches.length > 0 && (
        <div style={{ 
          padding: '0.75rem 1.25rem', 
          fontSize: '0.7rem', 
          color: '#1565c0', 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.8,
          marginTop: '0.25rem',
          borderTop: '1px solid rgba(21, 101, 192, 0.1)'
        }}>
          Khu vực lân cận
        </div>
      )}
      {query.trim().length === 0 && nearbyLocations.length > 0 && recentSearches.length === 0 && (
        <div style={{ 
          padding: '0.75rem 1.25rem', 
          fontSize: '0.7rem', 
          color: '#1565c0', 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.8
        }}>
          Khu vực lân cận
        </div>
      )}
      {displaySuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          style={{
            width: '100%',
            padding: '0.875rem 1.25rem',
            textAlign: 'left',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: primaryText || '#0d0c22',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: index === displaySuggestions.length - 1 ? '0 0 1.5rem 1.5rem' : '0',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(21, 101, 192, 0.08)';
            e.target.style.color = '#1565c0';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = primaryText || '#0d0c22';
          }}
        >
          {suggestion.nameVi || suggestion.name || suggestion}
        </button>
      ))}
    </div>
  );
}
