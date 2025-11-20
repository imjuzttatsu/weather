const WEATHER_CODE_TO_ICON_MAP = {
  0: 0,
  
  1: 1,
  2: 1,
  3: 1,
  
  45: 1,
  48: 1,
  
  51: 3,
  53: 3,
  55: 3,
  61: 3,
  63: 3,
  65: 3,
  80: 3,
  81: 3,
  82: 3,
  
  71: 1,
  73: 1,
  75: 1,
  77: 1,
  85: 1,
  86: 1,
  
  95: 4,
  96: 4,
  99: 4,
};

export const mapWeatherCodeToIcon = (code) => {
  if (code === null || code === undefined || code === '' || code === 'null' || code === 'undefined') {
    if (import.meta.env.DEV) {
      console.warn(`[ICON MAP] Null/undefined weather code, using default icon 1`);
    }
    return 1;
  }
  
  const numCode = typeof code === 'string' ? parseInt(code, 10) : Number(code);
  
  if (isNaN(numCode) || !isFinite(numCode)) {
    if (import.meta.env.DEV) {
      console.warn(`[ICON MAP] Invalid weather code (NaN): ${code} (type: ${typeof code}), using default icon 1`);
    }
    return 1;
  }
  
  const clampedCode = Math.max(0, Math.min(99, Math.floor(numCode)));
  
  const iconCode = WEATHER_CODE_TO_ICON_MAP[clampedCode];
  
  if (iconCode !== undefined) {
    if (import.meta.env.DEV) {
      console.log(`[ICON MAP] Weather code ${clampedCode} → Icon ${iconCode}`);
    }
    return iconCode;
  }
  
  if (clampedCode <= 3) return 1;
  if (clampedCode <= 49) return 1;
  if (clampedCode <= 69) return 3;
  if (clampedCode <= 89) return 1;
  if (clampedCode <= 99) return 4;
  
  if (import.meta.env.DEV) {
    console.warn(`[ICON MAP] Unexpected code: ${clampedCode}, using default icon 1`);
  }
  return 1;
};

export const translateWeatherDesc = (desc, descMap) => {
  if (!desc) return '';
  const descKey = desc || '';
  const translated = descMap[descKey] || 
    descMap[descKey.charAt(0).toUpperCase() + descKey.slice(1).toLowerCase()] || 
    descKey;
  return translated;
};

export const formatDayName = (day, dayMap) => {
  return dayMap[day] || day;
};

