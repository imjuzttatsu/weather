import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import SearchBar from './SearchBar.jsx';
import { MapPin, ChevronLeft } from 'lucide-react';
import { mapAPI, weatherAPI } from '../utils/api';
import { mapWeatherCodeToIcon } from '../utils/weather';
import IconWeather from './IconWeather';
import KebabMenu from './KebabMenu';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  const debouncedInvalidateSize = useRef(null);
  
  const invalidateSizeDebounced = () => {
    if (debouncedInvalidateSize.current) clearTimeout(debouncedInvalidateSize.current);
    debouncedInvalidateSize.current = setTimeout(() => {
      if (map && typeof map.invalidateSize === 'function') {
        map.invalidateSize();
      }
    }, 200);
  };
  
  useEffect(() => {
    if (!map || !center) return;
    
    try {
      map.flyTo(center, map.getZoom(), {
        duration: 0.8,
        easeLinearity: 0.1
      });
      invalidateSizeDebounced();
    } catch (e) {
      console.error('Map update error:', e);
    }
  }, [center, map]);
  
  useEffect(() => {
    if (!map) return;
    invalidateSizeDebounced();
  }, [map]);
  
  return null;
}

const createLoaderIcon = () => {
  const loaderHTML = `
    <div class="map-loader" style="
      width: 44.8px;
      height: 44.8px;
      position: relative;
      transform: rotate(45deg);
    ">
      <div class="map-loader-base" style="
        position: absolute;
        inset: 0;
        border-radius: 50% 50% 0 50%;
        background: transparent;
        background-image: radial-gradient(circle 11.2px at 50% 50%, transparent 94%, #ff4747);
      "></div>
      <div class="map-loader-pulse" style="
        position: absolute;
        inset: 0;
        border-radius: 50% 50% 0 50%;
        background: transparent;
        background-image: radial-gradient(circle 11.2px at 50% 50%, transparent 94%, #ff4747);
        animation: map-pulse-loader 1s infinite;
        transform: perspective(336px) translateZ(0px);
      "></div>
    </div>
  `;
  
  return new DivIcon({
    className: 'custom-loader-marker',
    html: loaderHTML,
    iconSize: [44.8, 44.8],
    iconAnchor: [22.4, 22.4],
  });
};

export default function MapPanel({
  mockSearch,
  currentLocation = { lat: 21.0285, lon: 105.8542, city: 'Hanoi' },
  onLocationChange,
  onPreviewLocation,
  motionEnabled,
  currentTheme,
  primaryText,
  setPage,
  openDetail,
  openSettings,
  isMenuOpen,
  setIsMenuOpen,
  isVisible = true,
}) {
  const [mapCenter, setMapCenter] = useState([currentLocation.lat, currentLocation.lon]);
  const [markerPosition, setMarkerPosition] = useState([currentLocation.lat, currentLocation.lon]);
  const [locationName, setLocationName] = useState(currentLocation.city);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const mapRef = useRef(null);
  const debouncedInvalidateSize = useRef(null);

  useEffect(() => {
    if (currentLocation && currentLocation.lat && currentLocation.lon) {
      const newCenter = [currentLocation.lat, currentLocation.lon];
      setMapCenter(newCenter);
      setMarkerPosition(newCenter);
      setLocationName(currentLocation.city || 'Unknown');
    }
  }, [currentLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderMap(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && shouldRenderMap) {
      invalidateSizeDebounced();
    }
  }, [mapCenter, shouldRenderMap, isVisible]);

  const meshGradient = `
    radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.85) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.75) 0%, transparent 70%),
    linear-gradient(180deg, rgba(135, 206, 235, 0.88) 0%, rgba(30, 144, 255, 0.9) 100%)
  `;
  
  const coloredShadow = `
    0px 20px 60px rgba(25, 118, 210, 0.4),
    0px 8px 25px rgba(25, 118, 210, 0.3),
    0px 0px 80px rgba(25, 118, 210, 0.25)
  `;
  
  const metricsColoredShadow = '0px 8px 20px rgba(25, 118, 210, 0.3), 0px 3px 10px rgba(25, 118, 210, 0.25)';

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: `
      ${metricsColoredShadow},
      inset 3px 3px 6px rgba(255, 255, 255, 0.5),
      inset -3px -3px 6px rgba(30, 144, 255, 0.2),
      inset 5px 5px 10px rgba(255, 255, 255, 0.3),
      inset -5px -5px 10px rgba(30, 144, 255, 0.15)
    `,
  };
  
  const previewCardStyle = {
    background: meshGradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `
      ${coloredShadow},
      inset 3px 3px 8px rgba(255, 255, 255, 0.4),
      inset -3px -3px 8px rgba(30, 144, 255, 0.3),
      inset 6px 6px 12px rgba(255, 255, 255, 0.2),
      inset -6px -6px 12px rgba(30, 144, 255, 0.25)
    `,
    border: 'none',
  };

  const invalidateSizeDebounced = () => {
    if (debouncedInvalidateSize.current) clearTimeout(debouncedInvalidateSize.current);
    debouncedInvalidateSize.current = setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 200);
  };

  const fetchPreviewCardData = async (lat, lon, cityName) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentData = await weatherAPI.getCurrentWeather(null, lat, lon);
      const rawWeatherCode = currentData.weather.weatherCode;
      const mappedIconCode = mapWeatherCodeToIcon(rawWeatherCode);
      
      setPreviewData({
        location: { lat, lon, city: cityName },
        weather: {
          temperature: currentData.weather.temperature,
          condition: currentData.weather.condition,
          weatherCode: mappedIconCode,
          tempMax: currentData.weather.temperature,
          tempMin: currentData.weather.temperature,
        }
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Preview card fetch error:', err);
      }
      setError('Lỗi khi lấy dữ liệu thời tiết');
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') return;
    
    setIsLoading(true);
    setError(null);
    setPreviewData(null); // Clear preview data
    
    try {
      const response = await mapAPI.searchLocation(query);
      if (response.results && response.results.length > 0) {
        const location = response.results[0];
        const newCenter = [location.lat, location.lon];
        setMapCenter(newCenter);
        setMarkerPosition(newCenter);
        const locationName = location.nameVi || location.name;
        setLocationName(locationName);
        
        if (mockSearch) mockSearch(query);
        
        await fetchPreviewCardData(location.lat, location.lon, locationName);
      } else {
        setError('Không tìm thấy địa điểm');
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Search error:', err);
      }
      setError('Lỗi khi tìm kiếm địa điểm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    const newCenter = [lat, lng];
    
    setMarkerPosition(newCenter);
    setMapCenter(newCenter);
    
    if (mapRef.current) {
      mapRef.current.flyTo(newCenter, 13, {
        duration: 0.8,
        easeLinearity: 0.1
      });
    }
    
    setIsLoading(true);
    setError(null);
    setPreviewData(null); // Clear preview data
    
    try {
      const location = await mapAPI.reverseGeocode(lat, lng);
      const locationName = location.nameVi || location.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      setLocationName(locationName);
      
      await fetchPreviewCardData(lat, lng, locationName);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Reverse geocode error:', err);
      }
      const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setLocationName(fallbackName);
      
      await fetchPreviewCardData(lat, lng, fallbackName);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewCardClick = () => {
    if (previewData && onPreviewLocation) {
      onPreviewLocation(
        previewData.location.lat,
        previewData.location.lon,
        previewData.location.city
      );
    }
  };


  return (
    <>
      <style>{`
        @keyframes map-pulse-loader {
          to {
            transform: perspective(336px) translateZ(168px) rotate(45deg);
            opacity: 0;
          }
        }
        .map-loader-pulse {
          animation: map-pulse-loader 1s infinite;
        }
        
        /* Style cho zoom controls */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0px 8px 20px rgba(25, 118, 210, 0.3), 0px 3px 10px rgba(25, 118, 210, 0.25) !important;
          border-radius: 1rem !important;
          overflow: hidden;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          color: #1565c0 !important;
          border: none !important;
          border-bottom: 1px solid rgba(21, 101, 192, 0.1) !important;
          transition: all 0.2s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(135, 206, 235, 0.9) !important;
          color: #FFFFFF !important;
        }
        
        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          font-size: 20px !important;
          line-height: 36px !important;
          width: 40px !important;
          height: 40px !important;
        }
      `}</style>
      <section className="h-full flex flex-col relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-center"
        style={{
          fontFamily: 'Open Sans, sans-serif',
          background: 'transparent',
          paddingTop: '2rem',
          paddingBottom: '1rem',
          zIndex: 40,
        }}
      >
        <KebabMenu
          setPage={setPage}
          openDetail={openDetail}
          openSettings={openSettings}
          currentTheme={currentTheme}
          primaryText={primaryText}
          size={24}
          color="#1565c0"
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          minimal={true}
        />
      </div>

      <div 
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center"
        style={{ 
          paddingTop: '2rem',
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          pointerEvents: 'none',
        }}
      >
        <button
          onClick={() => setPage && setPage(0)}
          className="absolute left-6 transition-all active:scale-95 hover:opacity-80"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            outline: 'none',
            boxShadow: 'none',
            pointerEvents: 'auto',
            zIndex: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '2rem',
            marginTop: '1px',
          }}
          aria-label="Quay lại"
        >
          <ChevronLeft size={30} color="#1565c0" />
        </button>
        
        <h2 
          className="text-2xl font-bold tracking-tight text-center"
          style={{ color: '#1565c0' }}
        >
          Bản đồ
        </h2>
      </div>

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
        {isLoading && (
          <div className="mt-2 text-sm text-center" style={{ color: primaryText, opacity: 0.7 }}>
            Đang tải...
          </div>
        )}
      </div>

      <div 
        className="flex-1 mb-4 rounded-3xl overflow-hidden"
        style={{ ...glassStyle, minHeight: '400px', position: 'relative', marginLeft: '1rem', marginRight: '1rem' }}
      >
        {shouldRenderMap ? (
          <MapContainer
            key="map-container"
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}
            scrollWheelZoom={true}
            eventHandlers={{
              click: handleMapClick
            }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
              invalidateSizeDebounced();
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPosition} icon={createLoaderIcon()}>
              <Popup>
                <div className="text-center">
                  <MapPin size={16} className="inline mb-1" />
                  <p className="font-semibold">{locationName}</p>
                  <p className="text-xs text-gray-500">
                    {markerPosition[0].toFixed(4)}, {markerPosition[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
            <MapUpdater center={mapCenter} />
            <ZoomControl position="bottomright" />
          </MapContainer>
        ) : (
          <div 
            style={{ 
              height: '100%', 
              width: '100%', 
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <p style={{ color: primaryText, opacity: 0.5 }}>Đang tải bản đồ...</p>
          </div>
        )}
      </div>
      
      {previewData && previewData.weather && (
        <div
          className="flex-shrink-0 mb-4 mx-4 p-5 rounded-3xl cursor-pointer transition-all active:scale-95 hover:opacity-90"
          style={previewCardStyle}
          onClick={handlePreviewCardClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div style={{ 
                width: '60px', 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                opacity: 1
              }}>
                <IconWeather
                  code={previewData.weather.weatherCode}
                  size={60}
                  motionEnabled={false}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold mb-1" style={{ color: '#FFFFFF' }}>
                  {previewData.location.city}
                </div>
                <div className="text-xs mb-1" style={{ color: '#FFFFFF', opacity: 0.9 }}>
                  {previewData.weather.condition}
                </div>
                <div className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                  {Math.round(previewData.weather.temperature)}°
                </div>
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: '#FFFFFF', opacity: 0.8 }}>
              Nhấn để xem chi tiết →
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-shrink-0 mx-4 mb-4 p-5 rounded-3xl"
        style={glassStyle}
      >
        <div className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: currentTheme.textSecondary, opacity: 0.8 }}>
          Vị trí hiện tại
        </div>
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: meshGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.25)',
          }}>
            <MapPin size={20} color="#FFFFFF" />
          </div>
          <span className="text-sm font-semibold flex-1" style={{ color: primaryText }}>
            {locationName}
          </span>
        </div>
      </div>
    </section>
    </>
  );
}
