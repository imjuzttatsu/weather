import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { mapAPI } from '../utils/api';

export default function SearchBar({ 
  mockSearch, 
  currentTheme, 
  primaryText,
  currentLocation = { lat: 21.0285, lon: 105.8542, city: 'Hanoi' }
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getNearbyLocations = () => {
    const nearby = [
      { name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
      { name: 'Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
      { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
      { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
      { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
    ];
    return nearby.filter(loc => 
      loc.name.toLowerCase() !== currentLocation.city?.toLowerCase()
    ).slice(0, 3);
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setShowSuggestions(false);
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    if (mockSearch) {
      mockSearch(searchQuery);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim().length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await mapAPI.searchLocation(value);
          setSuggestions(results.results?.slice(0, 5) || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 500);
    } else if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (typeof suggestion === 'string') {
      handleSearch(suggestion);
    } else {
      handleSearch(suggestion.nameVi || suggestion.name);
      if (mockSearch) {
        mockSearch(suggestion.nameVi || suggestion.name);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const nearbyLocations = getNearbyLocations();
  const displaySuggestions = query.trim().length > 0 
    ? suggestions 
    : [...recentSearches.map(s => ({ name: s, nameVi: s })), ...nearbyLocations];

  const metricsColoredShadow = '0px 8px 20px rgba(25, 118, 210, 0.3), 0px 3px 10px rgba(25, 118, 210, 0.25)';
  
  const inputStyle = {
    width: '100%',
    height: '48px',
    lineHeight: '24px',
    padding: '0 1rem',
    paddingLeft: '2.75rem',
    border: 'none',
    borderRadius: '1.5rem',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: primaryText || '#0d0c22',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    boxShadow: `
      ${metricsColoredShadow},
      inset 3px 3px 6px rgba(255, 255, 255, 0.5),
      inset -3px -3px 6px rgba(30, 144, 255, 0.2)
    `,
  };

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
      ${metricsColoredShadow},
      inset 2px 2px 4px rgba(255, 255, 255, 0.5),
      inset -2px -2px 4px rgba(30, 144, 255, 0.15)
    `,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <div ref={searchRef} className="relative" style={{ maxWidth: '100%', width: '100%' }}>
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
            left: '1rem',
            fill: '#1565c0',
            width: '1rem',
            height: '1rem',
            color: '#1565c0',
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

      {showSuggestions && displaySuggestions.length > 0 && (
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
      )}

      <style>{`
        .input::placeholder {
          color: #9e9ea7;
          opacity: 0.7;
        }
        .input:focus {
          outline: none;
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: 
            0px 8px 20px rgba(25, 118, 210, 0.35),
            0px 3px 10px rgba(25, 118, 210, 0.3),
            inset 3px 3px 6px rgba(255, 255, 255, 0.6),
            inset -3px -3px 6px rgba(30, 144, 255, 0.25),
            0 0 0 3px rgba(21, 101, 192, 0.1);
        }
        .input:hover {
          outline: none;
          background-color: rgba(255, 255, 255, 0.9);
          box-shadow: 
            0px 8px 20px rgba(25, 118, 210, 0.3),
            0px 3px 10px rgba(25, 118, 210, 0.25),
            inset 3px 3px 6px rgba(255, 255, 255, 0.55),
            inset -3px -3px 6px rgba(30, 144, 255, 0.22);
        }
      `}</style>
    </div>
  );
}
