import { useEffect, useRef } from 'react';

export default function useFinisherHeader(isDark) {
  const finisherInstanceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isDark) {
      if (finisherInstanceRef.current) {
        const container = containerRef.current || document.querySelector('.finisher-header');
        if (container) {
          const canvas = container.querySelector('canvas');
          if (canvas) {
            canvas.remove();
          }
        }
        finisherInstanceRef.current = null;
      }
      return;
    }

    if (typeof window === 'undefined' || !window.FinisherHeader) {
      console.warn('FinisherHeader script not loaded yet');
      return;
    }

    const container = document.querySelector('.finisher-header');
    if (!container) {
      console.warn('Finisher Header container not found');
      return;
    }

    containerRef.current = container;

    const config = {
      count: 80,
      size: {
        min: 2,
        max: 6,
        pulse: 0
      },
      speed: {
        x: {
          min: 0,
          max: 0.3
        },
        y: {
          min: 0,
          max: 0.5
        }
      },
      colors: {
        background: "#1a1a2e",
        particles: ["#64B5F6", "#42A5F5", "#90CAF9"]
      },
      blending: "overlay",
      opacity: {
        center: 0.6,
        edge: 0.2
      },
      skew: 0,
      shapes: ["c"]
    };

    try {
      if (finisherInstanceRef.current) {
        const oldCanvas = container.querySelector('canvas');
        if (oldCanvas) {
          oldCanvas.remove();
        }
      }

      finisherInstanceRef.current = new window.FinisherHeader(config);
    } catch (error) {
      console.error('Error initializing Finisher Header:', error);
    }

    return () => {
      if (finisherInstanceRef.current && container) {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          canvas.remove();
        }
        finisherInstanceRef.current = null;
      }
    };
  }, [isDark]);

  return finisherInstanceRef.current;
}

