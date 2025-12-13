import React from 'react';
import SearchBar from '../common/SearchBar';


export default function MapSearchSection({
  handleSearch,
  currentTheme,
  primaryText,
  currentLocation,
  error,
}) {
  return (
    <div className="flex-shrink-0 mb-4" style={{ marginTop: '5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <SearchBar 
        mockSearch={handleSearch} 
        currentTheme={currentTheme}
        primaryText={primaryText}
        currentLocation={currentLocation}
      />
      {error && (
        <div className="mt-2 text-sm text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
