import { useState, useEffect, useRef, useCallback } from 'react';

const OWM_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const FIXED_GRID_SIZE = 20;
const CACHE_TTL = 30 * 60 * 1000; // 30 phut
const BATCH_SIZE = 50;
const BATCH_DELAY = 100;

const VN_BOUNDS = {
  minLat: 8.0,
  maxLat: 24.5,
  minLon: 102.0,
  maxLon: 110.0,
};

// Hook fetch heatmap data doc lap voi map, chay ngay tu splash
export function useHeatmapData(enabled = true) {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const hasFetchedRef = useRef(false);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef({ points: null, timestamp: 0 });

  const fetchHeatmapData = useCallback(async () => {
    if (!enabled) return;
    
    // Da fetch roi thi dung cache
    if (hasFetchedRef.current && heatmapPoints.length > 0) {
      if (import.meta.env.DEV) {
        console.log(`[Heatmap] Da co ${heatmapPoints.length} diem, skip fetch`);
      }
      return;
    }

    // Check cache
    if (cacheRef.current.points && Date.now() - cacheRef.current.timestamp < CACHE_TTL) {
      setHeatmapPoints(cacheRef.current.points);
      hasFetchedRef.current = true;
      if (import.meta.env.DEV) {
        console.log(`[Heatmap] Dung cache (${cacheRef.current.points.length} diem)`);
      }
      return;
    }

    // Cancel request cu
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (!OWM_API_KEY) {
      console.warn('[Heatmap] Thieu VITE_OPENWEATHER_API_KEY');
      return;
    }

    try {
      setHeatmapLoading(true);
      if (import.meta.env.DEV) {
        console.log(`[Heatmap] Bat dau fetch ${(FIXED_GRID_SIZE + 1) * (FIXED_GRID_SIZE + 1)} diem...`);
      }

      // Tao grid points
      const { minLat, maxLat, minLon, maxLon } = VN_BOUNDS;
      const points = [];
      const latStep = (maxLat - minLat) / FIXED_GRID_SIZE;
      const lonStep = (maxLon - minLon) / FIXED_GRID_SIZE;

      for (let i = 0; i <= FIXED_GRID_SIZE; i++) {
        for (let j = 0; j <= FIXED_GRID_SIZE; j++) {
          points.push({
            lat: minLat + i * latStep,
            lon: minLon + j * lonStep
          });
        }
      }

      // Fetch tu OpenWeatherMap
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const results = [];

      for (let i = 0; i < points.length; i += BATCH_SIZE) {
        if (abortController.signal.aborted) return;

        const batch = points.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (point) => {
          try {
            const url = `${baseUrl}?lat=${point.lat}&lon=${point.lon}&appid=${OWM_API_KEY}&units=metric`;
            const response = await fetch(url, { signal: abortController.signal });
            
            if (abortController.signal.aborted) return null;
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            const temperature = data.main?.temp;
            if (temperature === null || temperature === undefined || isNaN(temperature)) return null;
            
            return { lat: point.lat, lon: point.lon, val: temperature };
          } catch (error) {
            if (error.name === 'AbortError') return null;
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(r => r !== null));

        // Delay ngan
        if (i + BATCH_SIZE < points.length) {
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }

        if (import.meta.env.DEV && (i + BATCH_SIZE) % 100 === 0) {
          console.log(`[Heatmap] Tien do: ${Math.min(i + BATCH_SIZE, points.length)}/${points.length}`);
        }
      }

      if (abortController.signal.aborted) return;

      if (results.length > 0) {
        setHeatmapPoints(results);
        cacheRef.current = { points: results, timestamp: Date.now() };
        hasFetchedRef.current = true;
        if (import.meta.env.DEV) {
          console.log(`[Heatmap] Hoan thanh! ${results.length} diem`);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[Heatmap] Loi:', error);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setHeatmapLoading(false);
      }
    }
  }, [enabled, heatmapPoints.length]);

  // Fetch ngay khi mount (trong splash)
  useEffect(() => {
    if (enabled && !hasFetchedRef.current) {
      fetchHeatmapData();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, fetchHeatmapData]);

  return { heatmapPoints, heatmapLoading, refetchHeatmap: fetchHeatmapData };
}

