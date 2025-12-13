/**
 * Utility functions for responsive design across different aspect ratios
 * Supports: 18.5:9, 19:9 (tall screens) and 16:9 (wide screens)
 */

/**
 * Calculate responsive value based on aspect ratio
 * @param {Object} options - Configuration object
 * @param {number} options.mobile - Value for mobile/small screens (px)
 * @param {number} options.desktop - Value for desktop/large screens (px)
 * @param {number} options.vwPercent - Viewport width percentage
 * @param {number} options.vhPercent - Viewport height percentage
 * @param {boolean} options.useMin - Use min(vw, vh) for balanced scaling
 */
export function getResponsiveValue({ mobile, desktop, vwPercent = 0, vhPercent = 0, useMin = false }) {
  if (typeof window === 'undefined') return mobile;

  const aspectRatio = window.innerWidth / window.innerHeight;
  
  // 18.5:9 ≈ 0.486, 19:9 ≈ 0.474 (tall screens)
  // 16:9 ≈ 0.5625 (wider screens)
  const isTallScreen = aspectRatio < 0.52; // < 18.5:9
  const isWideScreen = aspectRatio > 0.55; // > 16:9
  
  let baseValue;
  
  if (useMin) {
    // Use the smaller of vw or vh for balanced scaling
    const vw = window.innerWidth * (vwPercent / 100);
    const vh = window.innerHeight * (vhPercent / 100);
    baseValue = Math.min(vw, vh);
  } else {
    // Adjust based on aspect ratio
    if (isTallScreen) {
      // Tall screens: prefer vw, reduce vh
      baseValue = window.innerWidth * (vwPercent / 100) * 1.1;
    } else if (isWideScreen) {
      // Wide screens: prefer vh, reduce vw
      baseValue = window.innerHeight * (vhPercent / 100) * 1.1;
    } else {
      // Balanced: use average
      const vw = window.innerWidth * (vwPercent / 100);
      const vh = window.innerHeight * (vhPercent / 100);
      baseValue = (vw + vh) / 2;
    }
  }
  
  // Clamp between mobile and desktop
  return Math.max(mobile, Math.min(desktop, baseValue));
}

/**
 * Get responsive spacing value with aspect ratio awareness
 */
export function getResponsiveSpacing(minPx, maxPx, vwPercent = 0, vhPercent = 0) {
  const value = getResponsiveValue({
    mobile: minPx,
    desktop: maxPx,
    vwPercent,
    vhPercent,
    useMin: true
  });
  
  return `${value}px`;
}

/**
 * React hook for responsive values that update on resize
 */
export function useResponsiveValue(config) {
  const { useState, useEffect } = require('react');
  const [value, setValue] = useState(() => getResponsiveValue(config));
  
  useEffect(() => {
    const updateValue = () => setValue(getResponsiveValue(config));
    updateValue();
    window.addEventListener('resize', updateValue);
    return () => window.removeEventListener('resize', updateValue);
  }, [config.mobile, config.desktop, config.vwPercent, config.vhPercent]);
  
  return value;
}

