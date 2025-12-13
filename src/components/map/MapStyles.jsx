import React from 'react';


export default function MapStyles() {
  return (
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

      /* Mapbox specific styles */
      .mapboxgl-popup-content {
        border-radius: 0.5rem !important;
        box-shadow: 0px 8px 20px rgba(25, 118, 210, 0.3) !important;
      }

      .mapboxgl-popup-close-button {
        font-size: 20px !important;
        padding: 4px 8px !important;
        color: #1565c0 !important;
      }

      .mapboxgl-ctrl-group {
        border: none !important;
        box-shadow: 0px 8px 20px rgba(25, 118, 210, 0.3), 0px 3px 10px rgba(25, 118, 210, 0.25) !important;
        border-radius: 1rem !important;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
      }
      
      .mapboxgl-ctrl button {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        color: #1565c0 !important;
        border: none !important;
        border-bottom: 1px solid rgba(21, 101, 192, 0.1) !important;
        transition: all 0.2s ease !important;
        width: 40px !important;
        height: 40px !important;
      }
      
      .mapboxgl-ctrl button:hover {
        background: rgba(135, 206, 235, 0.9) !important;
        color: #FFFFFF !important;
      }
      
      .mapboxgl-ctrl button:last-child {
        border-bottom: none !important;
      }
    `}</style>
  );
}
