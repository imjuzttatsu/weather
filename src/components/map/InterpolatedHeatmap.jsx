import React, { useEffect, useRef } from 'react';
import { create as interpolateHeatmapLayer } from 'interpolateheatmaplayer';

/**
 * InterpolatedHeatmap Component
 * Sử dụng InterpolateHeatmapLayer để tạo temperature heatmap với interpolation
 * (khác với Mapbox native heatmap - đây là average/interpolation, không phải density)
 */
export default function InterpolatedHeatmap({ 
  mapInstance, 
  points = [], 
  enabled = true,
  opacity = 0.6
}) {
  const layerRef = useRef(null);

  // Helper function để format points
  const formatPoints = (points) => {
    return points.map(p => ({
      lat: p.lat,
      lon: p.lon || p.lng || p.longitude,
      val: p.val || p.temperature || p.temp || 25
    })).filter(p => {
      return p.lat >= -85 && p.lat <= 85 && 
             p.lon >= -180 && p.lon <= 180 &&
             !isNaN(p.val);
    });
  };

  // Helper function để tạo layer
  const createLayer = (formattedPoints) => {
    if (formattedPoints.length === 0) {
      console.warn('[InterpolatedHeatmap] No valid points');
      return null;
    }

    // Dùng cấu hình mặc định của interpolateHeatmapLayer (giống tutorial)
    const layer = interpolateHeatmapLayer({
      points: formattedPoints,
      layerId: 'interpolated-heatmap',
      opacity: opacity,
      p: 3,
      pointRadius: 0,
      framebufferFactor: 0.25, // Giảm để nhanh hơn
      layerBlendingFactor: WebGLRenderingContext.SRC_ALPHA,
      mapBlendingFactor: WebGLRenderingContext.ONE_MINUS_SRC_ALPHA
    });

    return layer;
  };

  // Effect: Create/remove/update layer
  useEffect(() => {
    if (!mapInstance || !enabled) {
      // Remove layer if exists
      if (layerRef.current && mapInstance) {
        try {
          if (layerRef.current._cleanup) {
            layerRef.current._cleanup();
          }
          if (mapInstance.getLayer('interpolated-heatmap')) {
            mapInstance.removeLayer('interpolated-heatmap');
          }
          if (mapInstance.getSource('interpolated-heatmap')) {
            mapInstance.removeSource('interpolated-heatmap');
          }
        } catch (e) {
          if (import.meta.env.DEV) {
            console.warn('Error removing heatmap layer:', e);
          }
        }
      }
      layerRef.current = null;
      return;
    }

    if (!points || points.length === 0) {
      return;
    }

    const formattedPoints = formatPoints(points);
    if (formattedPoints.length === 0) {
      return;
    }

    // Wait for map to be ready
    const addOrUpdateLayer = () => {
      try {
        const existingLayer = mapInstance.getLayer('interpolated-heatmap');
        
        if (existingLayer && layerRef.current) {
          // Update existing layer
          if (layerRef.current.updatePoints) {
            layerRef.current.updatePoints(formattedPoints);
            if (layerRef.current.resizeFramebuffer) {
              try {
                layerRef.current.resizeFramebuffer();
              } catch (e) {}
            }
            if (import.meta.env.DEV) {
              console.log(`[InterpolatedHeatmap] Updated with ${formattedPoints.length} points`);
            }
            return;
          }
        }

        // Create new layer
        if (existingLayer) {
          mapInstance.removeLayer('interpolated-heatmap');
          if (mapInstance.getSource('interpolated-heatmap')) {
            mapInstance.removeSource('interpolated-heatmap');
          }
        }

        const layer = createLayer(formattedPoints);
        if (!layer) return;

        mapInstance.addLayer(layer);
        layerRef.current = layer;

        // Handle resize để update framebuffer khi zoom
        const handleResize = () => {
          if (layerRef.current?.resizeFramebuffer) {
            try {
              layerRef.current.resizeFramebuffer();
            } catch (e) {
              console.warn('[InterpolatedHeatmap] Error resizing framebuffer:', e);
            }
          }
        };

        mapInstance.on('resize', handleResize);
        mapInstance.on('zoom', handleResize);
        mapInstance.on('moveend', handleResize);

        layerRef.current._cleanup = () => {
          mapInstance.off('resize', handleResize);
          mapInstance.off('zoom', handleResize);
          mapInstance.off('moveend', handleResize);
        };

        if (import.meta.env.DEV) {
          const values = formattedPoints.map(p => p.val);
          const calculatedMin = Math.min(...values);
          const calculatedMax = Math.max(...values);
          console.log(`[InterpolatedHeatmap] Layer created with ${formattedPoints.length} points, temp range: ${calculatedMin.toFixed(1)}°C - ${calculatedMax.toFixed(1)}°C`);
        }
      } catch (error) {
        console.error('[InterpolatedHeatmap] Error creating/updating heatmap layer:', error);
      }
    };

    if (!mapInstance.isStyleLoaded()) {
      mapInstance.once('styledata', addOrUpdateLayer);
    } else {
      addOrUpdateLayer();
    }
  }, [mapInstance, enabled, points, opacity]);

  return null; // This component doesn't render anything
}
