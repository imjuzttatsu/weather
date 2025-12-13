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
  
  border: 'rgba(255, 255, 255, 0.3)',
  background: 'linear-gradient(-45deg, #E3F2FD, #F0F8FF, #E1F5FE, #E0F2F1, #F0F8FF, #E3F2FD)',
};

const darkTheme = {
  heroGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  
  glowShadow: '0px 8px 20px rgba(100, 181, 246, 0.4), 0px 20px 50px rgba(100, 181, 246, 0.2)',
  
  cardBg: "rgba(30, 30, 50, 0.4)",
  cardBgLight: "rgba(30, 30, 50, 0.35)",
  cardBgStrong: "rgba(30, 30, 50, 0.45)",
  cardBgDark: "rgba(30, 30, 50, 0.4)",
  
  primary: '#64B5F6',
  primaryDark: '#42A5F5',
  
  accent: '#64B5F6',
  accentDark: '#42A5F5',
  accentLight: '#90CAF9',
  
  iconSun: '#FFD54F',
  iconCloud: '#FFFFFF',
  iconRain: '#64B5F6',
  iconStorm: '#FFD54F',
  
  text: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textLight: '#BDBDBD',
  textDark: '#FFFFFF',
  
  heroText: '#FFFFFF',
  heroTextShadow: 'rgba(100, 181, 246, 0.5)',
  
  neoBackground: '#1a1a2e',
  neoShadowLight: 'rgba(255, 255, 255, 0.15)',
  neoShadowDark: 'rgba(0, 0, 0, 0.4)',
  
  border: 'rgba(255, 255, 255, 0.15)',
  borderDark: 'rgba(255, 255, 255, 0.2)',
  background: '#1a1a2e',
  particles: ["#64B5F6", "#42A5F5", "#90CAF9"],
  
  hourlyActiveGradient: `
    radial-gradient(circle at 30% 30%, rgba(100, 181, 246, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(66, 165, 245, 0.35) 0%, transparent 50%),
    linear-gradient(180deg, rgba(30, 30, 50, 0.5) 0%, rgba(30, 30, 50, 0.6) 100%)
  `,
  hourlyInactiveGradient: 'rgba(30, 30, 50, 0.4)',
  
  footerGradient: `
    radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(66, 165, 245, 0.25) 0%, transparent 50%),
    linear-gradient(90deg, rgba(30, 30, 50, 0.4) 0%, rgba(30, 30, 50, 0.5) 50%, rgba(30, 30, 50, 0.4) 100%)
  `,
};

export default function useWeatherTheme(themeMode, isDark, weatherCode) {
  const currentTheme = useMemo(() => {
    return isDark ? darkTheme : modernBlueTheme;
  }, [themeMode, isDark, weatherCode]);

  const primaryText = useMemo(() => {
    return isDark ? darkTheme.text : modernBlueTheme.text;
  }, [isDark]);

  const secondaryText = useMemo(() => {
    return isDark ? darkTheme.textSecondary : modernBlueTheme.textSecondary;
  }, [isDark]);

  return { currentTheme, primaryText, secondaryText };
}