/**
 * BẢNG TRA CỨU WMO WEATHER CODE CHUẨN QUỐC TẾ
 * Nguồn: World Meteorological Organization (WMO) Code Table 4677
 * Áp dụng cho OpenMeteo API
 */

export const WMO_CODE_TABLE = {
  // NHÓM 0: TRỜI QUANG
  0: {
    wmo: 0,
    category: "Clear",
    en: "Clear sky",
    vi: "Quang đãng",
    dayIcon: "clear_day.svg",
    nightIcon: "clear_night.svg",
    description: "Bầu trời trong xanh, không mây"
  },

  // NHÓM 1-3: CÓ MÂY
  1: {
    wmo: 1,
    category: "MainlyClear",
    en: "Mainly clear",
    vi: "Quang đãng",
    dayIcon: "clear_day.svg",
    nightIcon: "clear_night.svg",
    description: "Chủ yếu quang đãng (mây < 25%)"
  },
  2: {
    wmo: 2,
    category: "PartlyCloudy",
    en: "Partly cloudy",
    vi: "Có mây",
    dayIcon: "partly_cloud_day.svg",
    nightIcon: "partly_cloud_night.svg",
    description: "Một phần có mây (mây 25-50%)"
  },
  3: {
    wmo: 3,
    category: "Overcast",
    en: "Overcast",
    vi: "U ám",
    dayIcon: "overcast.svg",
    nightIcon: "overcast.svg",
    description: "Trời u ám (mây > 50%)"
  },

  // NHÓM 45-48: SƯƠNG MÙ
  45: {
    wmo: 45,
    category: "Fog",
    en: "Fog",
    vi: "Sương mù",
    dayIcon: "fog.svg",
    nightIcon: "fog.svg",
    description: "Sương mù dày đặc"
  },
  48: {
    wmo: 48,
    category: "RimeFog",
    en: "Depositing rime fog",
    vi: "Sương mù nhẹ",
    dayIcon: "haze.svg",
    nightIcon: "haze.svg",
    description: "Sương mù có thể đóng băng"
  },

  // NHÓM 51-57: MƯA PHÙN
  51: {
    wmo: 51,
    category: "LightDrizzle",
    en: "Drizzle: Light intensity",
    vi: "Mưa phùn",
    dayIcon: "rain_drizzle.svg",
    nightIcon: "rain_drizzle.svg",
    description: "Mưa phùn nhẹ"
  },
  53: {
    wmo: 53,
    category: "ModerateDrizzle",
    en: "Drizzle: Moderate intensity",
    vi: "Mưa phùn",
    dayIcon: "rain_drizzle.svg",
    nightIcon: "rain_drizzle.svg",
    description: "Mưa phùn vừa"
  },
  55: {
    wmo: 55,
    category: "DenseDrizzle",
    en: "Drizzle: Dense intensity",
    vi: "Mưa phùn",
    dayIcon: "rain_drizzle.svg",
    nightIcon: "rain_drizzle.svg",
    description: "Mưa phùn dày đặc"
  },
  56: {
    wmo: 56,
    category: "LightFreezingDrizzle",
    en: "Freezing Drizzle: Light intensity",
    vi: "Mưa phùn",
    dayIcon: "rain_drizzle.svg",
    nightIcon: "rain_drizzle.svg",
    description: "Mưa phùn đóng băng nhẹ"
  },
  57: {
    wmo: 57,
    category: "DenseFreezingDrizzle",
    en: "Freezing Drizzle: Dense intensity",
    vi: "Mưa phùn",
    dayIcon: "rain_drizzle.svg",
    nightIcon: "rain_drizzle.svg",
    description: "Mưa phùn đóng băng dày"
  },

  // NHÓM 61-67: MƯA
  61: {
    wmo: 61,
    category: "SlightRain",
    en: "Rain: Slight intensity",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Mưa nhẹ"
  },
  63: {
    wmo: 63,
    category: "ModerateRain",
    en: "Rain: Moderate intensity",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Mưa vừa"
  },
  65: {
    wmo: 65,
    category: "HeavyRain",
    en: "Rain: Heavy intensity",
    vi: "Mưa lớn",
    dayIcon: "rain_heavy.svg",
    nightIcon: "rain_heavy.svg",
    description: "Mưa to"
  },
  66: {
    wmo: 66,
    category: "LightFreezingRain",
    en: "Freezing Rain: Light intensity",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Mưa đóng băng nhẹ"
  },
  67: {
    wmo: 67,
    category: "HeavyFreezingRain",
    en: "Freezing Rain: Heavy intensity",
    vi: "Mưa lớn",
    dayIcon: "rain_heavy.svg",
    nightIcon: "rain_heavy.svg",
    description: "Mưa đóng băng nặng"
  },

  // NHÓM 71-77: TUYẾT
  71: {
    wmo: 71,
    category: "SlightSnowFall",
    en: "Snow fall: Slight intensity",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Tuyết rơi nhẹ"
  },
  73: {
    wmo: 73,
    category: "ModerateSnowFall",
    en: "Snow fall: Moderate intensity",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Tuyết rơi vừa"
  },
  75: {
    wmo: 75,
    category: "HeavySnowFall",
    en: "Snow fall: Heavy intensity",
    vi: "Mưa lớn",
    dayIcon: "rain_heavy.svg",
    nightIcon: "rain_heavy.svg",
    description: "Tuyết rơi dày đặc"
  },
  77: {
    wmo: 77,
    category: "SnowGrains",
    en: "Snow grains",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Hạt tuyết"
  },

  // NHÓM 80-82: MƯA RÀO
  80: {
    wmo: 80,
    category: "SlightRainShowers",
    en: "Rain showers: Slight",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Mưa rào nhẹ"
  },
  81: {
    wmo: 81,
    category: "ModerateRainShowers",
    en: "Rain showers: Moderate",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Mưa rào vừa"
  },
  82: {
    wmo: 82,
    category: "ViolentRainShowers",
    en: "Rain showers: Violent",
    vi: "Mưa lớn",
    dayIcon: "rain_heavy.svg",
    nightIcon: "rain_heavy.svg",
    description: "Mưa rào dữ dội"
  },

  // NHÓM 85-86: MƯA TUYẾT
  85: {
    wmo: 85,
    category: "SlightSnowShowers",
    en: "Snow showers: Slight",
    vi: "Mưa",
    dayIcon: "rain_day.svg",
    nightIcon: "rain_night.svg",
    description: "Mưa tuyết nhẹ"
  },
  86: {
    wmo: 86,
    category: "HeavySnowShowers",
    en: "Snow showers: Heavy",
    vi: "Mưa lớn",
    dayIcon: "rain_heavy.svg",
    nightIcon: "rain_heavy.svg",
    description: "Mưa tuyết nặng"
  },

  // NHÓM 95-99: DÔNG
  95: {
    wmo: 95,
    category: "Thunderstorm",
    en: "Thunderstorm: Slight or moderate",
    vi: "Dông",
    dayIcon: "thunderstorm.svg",
    nightIcon: "thunderstorm.svg",
    description: "Dông nhẹ hoặc vừa"
  },
  96: {
    wmo: 96,
    category: "ThunderstormWithSlightHail",
    en: "Thunderstorm with slight hail",
    vi: "Mưa dông",
    dayIcon: "thunderstorm_rain.svg",
    nightIcon: "thunderstorm_rain.svg",
    description: "Dông kèm mưa đá nhẹ"
  },
  99: {
    wmo: 99,
    category: "ThunderstormWithHeavyHail",
    en: "Thunderstorm with heavy hail",
    vi: "Mưa dông",
    dayIcon: "thunderstorm_rain.svg",
    nightIcon: "thunderstorm_rain.svg",
    description: "Dông kèm mưa đá nặng"
  }
};

/**
 * Hàm tra cứu thông tin thời tiết từ WMO code
 * @param {number} wmoCode - Mã WMO từ OpenMeteo (0-99)
 * @param {boolean} isDay - true = ban ngày, false = ban đêm
 * @param {object} options - { windSpeed, aqi, previousCode }
 * @returns {Object} Thông tin thời tiết đầy đủ
 */
export function getWeatherFromWMO(wmoCode, isDay = true, options = {}) {
  const { windSpeed = null, aqi = null, previousCode = null } = options;
  
  const weather = WMO_CODE_TABLE[wmoCode];
  
  if (!weather) {
    if (import.meta.env.DEV) {
      console.warn(`[WMO] Code ${wmoCode} không hợp lệ, dùng default`);
    }
    // Default: partly cloudy
    return {
      wmo: wmoCode,
      category: "Unknown",
      en: "Unknown",
      vi: "Không xác định",
      icon: isDay ? "partly_cloud_day.svg" : "partly_cloud_night.svg",
      description: "Không xác định"
    };
  }
  
  // Logic đặc biệt
  let icon = isDay ? weather.dayIcon : weather.nightIcon;
  
  // 1. Windy: Ưu tiên cao nhất nếu gió > 20 km/h
  if (windSpeed != null && windSpeed > 20) {
    icon = "windy.svg";
  }
  
  // 2. Haze: Nếu AQI > 150 và code 45/48
  if (aqi != null && aqi > 150 && (wmoCode === 45 || wmoCode === 48)) {
    icon = "haze.svg";
  }
  
  // 3. Rainbow: Nếu code 0 và trước đó là mưa
  if (wmoCode === 0 && previousCode != null && previousCode >= 51 && previousCode <= 82) {
    icon = "rainbow.svg";
  }
  
  return {
    wmo: weather.wmo,
    category: weather.category,
    en: weather.en,
    vi: weather.vi,
    icon: icon,
    description: weather.description,
    isDay: isDay
  };
}

