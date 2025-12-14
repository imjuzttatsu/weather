import React, { useEffect, useRef, useState } from 'react';
import { default as MapGL, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { METRICS_COLORED_SHADOW } from '../../constants/styles';
import InterpolatedHeatmap from './InterpolatedHeatmap';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function MapContainer({
  mapCenter,
  markerPosition,
  locationName,
  handleMapClick,
  handleMarkerClick,
  markerTemperature,
  mapRef,
  primaryText,
  shouldRenderMap,
  heatmapEnabled = false,
  heatmapPoints = [],
  heatmapLoading = false,
  isDark = false,
  skipFlyTo = false,
}) {
  const [viewState, setViewState] = useState({
    longitude: mapCenter[1] || 105.8342,
    latitude: mapCenter[0] || 21.0278,
    zoom: 9,
    minZoom: 2,
    maxZoom: 18
  });
  
  const [popupInfo, setPopupInfo] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  
  const isDraggingRef = useRef(false);
  const lastMapCenterRef = useRef(null);
  const isUserInteractingRef = useRef(false);
  const isMovingRef = useRef(false);

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: `
      ${METRICS_COLORED_SHADOW},
      inset 3px 3px 6px rgba(255, 255, 255, 0.5),
      inset -3px -3px 6px rgba(30, 144, 255, 0.2),
      inset 5px 5px 10px rgba(255, 255, 255, 0.3),
      inset -5px -5px 10px rgba(30, 144, 255, 0.15)
    `,
  };

  useEffect(() => {
    if (skipFlyTo || isUserInteractingRef.current || isMovingRef.current) {
      return;
    }
    
    if (mapCenter && mapCenter[0] && mapCenter[1]) {
      const centerKey = `${mapCenter[0]}_${mapCenter[1]}`;
      const lastKey = lastMapCenterRef.current ? `${lastMapCenterRef.current[0]}_${lastMapCenterRef.current[1]}` : null;
      
      if (centerKey !== lastKey) {
        setViewState(prev => ({
          ...prev,
          longitude: mapCenter[1],
          latitude: mapCenter[0],
        }));
        
        if (mapInstance) {
          mapInstance.flyTo({
            center: [mapCenter[1], mapCenter[0]],
            duration: 600,
            essential: true
          });
        }
        
        lastMapCenterRef.current = mapCenter;
      }
    }
  }, [mapCenter, mapInstance, skipFlyTo]);

  useEffect(() => {
    if (mapInstance && mapRef) {
      mapRef.current = mapInstance;
    }
  }, [mapInstance, mapRef]);

  const handleMapLoad = (event) => {
    const map = event.target;
    setMapInstance(map);
    
    // Force 2D mode - đảm bảo không có 3D
    if (map) {
      // Set 2D projection (mercator)
      if (map.setProjection) {
        map.setProjection({ name: 'mercator' });
      }
      map.setPitch(0);
      map.setBearing(0);
      
      // Disable 3D features khi style load xong
      map.once('styledata', () => {
        try {
          if (map.getStyle().layers) {
            map.getStyle().layers.forEach((layer) => {
              // Hide 3D building extrusion
              if (layer.type === 'fill-extrusion') {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
              }
            });
          }
        } catch (e) {
          // Ignore
        }
      });
    }
    
    if (mapRef) {
      mapRef.current = map;
    }
    // Mapbox tự động handle resize, không cần invalidateSize
  };
  

  const handleClick = (event) => {
    // Khong xu ly click neu dang keo ban do
    if (isDraggingRef.current) {
      return;
    }
    if (handleMapClick) {
      // Convert Mapbox event to Leaflet-like format
      const latlng = {
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
        latlng: event.lngLat
      };
      handleMapClick({ latlng });
    }
  };

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here' || MAPBOX_TOKEN.trim() === '') {
    if (import.meta.env.DEV) {
      console.warn('Mapbox token not set. Please add VITE_MAPBOX_TOKEN to your .env file');
    }
  }

  return (
    <div 
      data-map-container
      className="flex-1 mb-4 rounded-3xl overflow-hidden"
      style={{ ...glassStyle, minHeight: '400px', position: 'relative', marginLeft: '1rem', marginRight: '1rem' }}
    >
      {shouldRenderMap ? (
        <>
          <MapGL
            {...viewState}
            onMoveStart={() => {
              isMovingRef.current = true;
              isUserInteractingRef.current = true;
            }}
            onMove={(evt) => {
              setViewState(evt.viewState);
            }}
            onMoveEnd={() => {
              setTimeout(() => {
                isMovingRef.current = false;
                isUserInteractingRef.current = false;
              }, 200);
            }}
            onDragStart={() => {
              isDraggingRef.current = true;
              isUserInteractingRef.current = true;
              isMovingRef.current = true;
            }}
            onDragEnd={() => {
              setTimeout(() => {
                isDraggingRef.current = false;
                isUserInteractingRef.current = false;
                isMovingRef.current = false;
              }, 200);
            }}
            onClick={handleClick}
            onLoad={handleMapLoad}
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
            mapStyle="mapbox://styles/mapbox/light-v10"
            attributionControl={false}
            reuseMaps
            projection={{ name: 'mercator' }}
            pitch={0}
            bearing={0}
          >
            {/* Marker */}
            {markerPosition && markerPosition[0] && markerPosition[1] && (
              <>
                <Marker
                  longitude={markerPosition[1]}
                  latitude={markerPosition[0]}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    
                    // Gọi handler riêng cho marker click (không loading, không API)
                    if (handleMarkerClick) {
                      handleMarkerClick(markerPosition[0], markerPosition[1]);
                    }
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Marker pin */}
                    <div
                      style={{
                        width: '44.8px',
                        height: '44.8px',
                        position: 'relative',
                        transform: 'rotate(45deg)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50% 50% 0 50%',
                          background: 'transparent',
                          backgroundImage: 'radial-gradient(circle 11.2px at 50% 50%, transparent 94%, #ff4747)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50% 50% 0 50%',
                          background: 'transparent',
                          backgroundImage: 'radial-gradient(circle 11.2px at 50% 50%, transparent 94%, #ff4747)',
                          animation: 'map-pulse-loader 1s infinite',
                        }}
                      />
                    </div>
                    
                    {/* Thẻ nhiệt độ hiển thị NGAY CẠNH marker */}
                    {markerTemperature !== null && markerTemperature !== undefined && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginBottom: '12px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#1a1a1a',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          zIndex: 1000,
                          pointerEvents: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>🌡️</span>
                        <span style={{ 
                          fontSize: '20px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          {Math.round(markerTemperature)}°C
                        </span>
                        {/* Arrow pointer */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid rgba(255, 255, 255, 0.95)',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Marker>
              </>
            )}

            {/* Interpolated Heatmap Layer */}
            <InterpolatedHeatmap
              mapInstance={mapInstance}
              points={heatmapPoints}
              enabled={heatmapEnabled}
              opacity={0.6}
            />

          </MapGL>
        </>
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
  );
}
