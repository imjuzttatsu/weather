import { useMemo } from "react";

const modernBlueTheme = {
  heroGradient: 'linear-gradient(135deg, #5E6FFF 0%, #4857D9 100%)',
  
  glowShadow: '0px 8px 20px rgba(88, 111, 255, 0.35), 0px 20px 50px rgba(88, 111, 255, 0.15)',
  
  cardBg: "rgba(255, 255, 255, 0.25)",
  cardBgLight: "rgba(255, 255, 255, 0.20)",
  cardBgStrong: "rgba(255, 255, 255, 0.30)",
  
  primary: '#5E6FFF',
  primaryDark: '#4857D9',
  
  accent: '#64B5F6',
  accentDark: '#1976D2',
  accentLight: '#90CAF9',
  
  iconSun: '#FFD54F',
  iconCloud: '#FFFFFF',
  iconRain: '#64B5F6',
  iconStorm: '#FFD54F',
  
  text: '#1565C0',
  textSecondary: '#1E88E5',
  textLight: '#42A5F5',
  
  neoBackground: '#EBF5FF',
  neoShadowLight: 'rgba(255, 255, 255, 0.8)',
  neoShadowDark: 'rgba(0, 0, 0, 0.1)',
};

export default function useWeatherTheme(themeMode, isDark, weatherCode) {
  const primaryText = modernBlueTheme.text;
  const secondaryText = modernBlueTheme.textSecondary;

  const currentTheme = useMemo(() => {
    return modernBlueTheme;
  }, [themeMode, isDark, weatherCode]);

  return { currentTheme, primaryText, secondaryText };
}