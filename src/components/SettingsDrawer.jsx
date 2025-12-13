import SettingsHeader from './settings/SettingsHeader';
import SettingsThemeSection from './settings/SettingsThemeSection';
import SettingsToggleSection from './settings/SettingsToggleSection';
import SettingsTempUnitSection from './settings/SettingsTempUnitSection';

export default function SettingsDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  themeMode,
  setThemeMode,
  isDark,
  setIsDark,
  soundEnabled,
  setSoundEnabled,
  motionEnabled,
  setMotionEnabled,
  tempUnit,
  setTempUnit,
  currentTheme,
  primaryText,
  secondaryText,
  gpsEnabled,
  toggleGPS,
  heatmapEnabled,
  setHeatmapEnabled,
}) {
  
  // Determine if dark mode
  const isDarkMode = currentTheme.cardBg && currentTheme.cardBg.includes('rgba(30, 30, 50');
  
  return (
    <>
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 z-40 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(58, 141, 255, 0.15)',
        }}
        onClick={() => setIsDrawerOpen(false)}
      />
      
      <div 
        className={`absolute inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`} 
        style={{ 
          background: currentTheme.cardBgStrong || currentTheme.cardBg || 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: `1px solid ${currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)')}`,
          boxShadow: isDarkMode ? `
            -5px 0 20px rgba(100, 181, 246, 0.15),
            -2px 0 10px rgba(100, 181, 246, 0.1)
          ` : `
            -5px 0 20px rgba(58, 141, 255, 0.15),
            -2px 0 10px rgba(58, 141, 255, 0.1)
          `,
          width: 'clamp(280px, 85vw, 320px)',
        }}
      >
        <SettingsHeader 
          setIsDrawerOpen={setIsDrawerOpen}
          currentTheme={currentTheme}
          primaryText={primaryText}
        />
        
        <div className="overflow-y-auto h-full scrollbar-hide" style={{ paddingBottom: 'clamp(4rem, 12vh, 6rem)' }}>
          <div style={{ gap: 'clamp(1rem, 3vh, 1.5rem)', padding: 'clamp(1rem, 4vw, 1.5rem)' }} className="flex flex-col">
            {/* Section: Giao diện */}
            <div>
              <h3 
                className="font-semibold uppercase tracking-wider"
                style={{ 
                  color: primaryText,
                  opacity: 0.7,
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                  marginBottom: 'clamp(0.5rem, 2vh, 0.75rem)'
                }}
              >
                Giao diện
              </h3>
              <SettingsThemeSection
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                isDark={isDark}
                setIsDark={setIsDark}
                primaryText={primaryText}
                currentTheme={currentTheme}
              />
            </div>

            <div className="border-t" style={{ borderColor: currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(58, 141, 255, 0.15)') }} />

            {/* Section: Đơn vị */}
            <div>
              <SettingsTempUnitSection
                tempUnit={tempUnit}
                setTempUnit={setTempUnit}
                primaryText={primaryText}
                currentTheme={currentTheme}
              />
            </div>

            <div className="border-t" style={{ borderColor: currentTheme.border || (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(58, 141, 255, 0.15)') }} />

            {/* Section: Tính năng */}
            <div>
              <h3 
                className="font-semibold uppercase tracking-wider"
                style={{ 
                  color: primaryText,
                  opacity: 0.7,
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                  marginBottom: 'clamp(0.5rem, 2vh, 0.75rem)'
                }}
              >
                Tính năng
              </h3>
              <div style={{ gap: 'clamp(0.5rem, 2vh, 0.75rem)' }} className="flex flex-col">
                <SettingsToggleSection
                  title="Âm thanh nền"
                  description="Âm thanh thời tiết"
                  checked={soundEnabled}
                  onChange={setSoundEnabled}
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  currentTheme={currentTheme}
                />

                <SettingsToggleSection
                  title="Hiệu ứng chuyển động"
                  description="Hoạt ảnh & chuyển cảnh"
                  checked={motionEnabled}
                  onChange={setMotionEnabled}
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  currentTheme={currentTheme}
                />

                <SettingsToggleSection
                  title="Vị trí GPS"
                  description="Sử dụng vị trí hiện tại của bạn"
                  checked={gpsEnabled}
                  onChange={(checked) => toggleGPS(checked)}
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  currentTheme={currentTheme}
                />

                <SettingsToggleSection
                  title="Bản đồ nhiệt độ"
                  description="Hiển thị heatmap nhiệt độ trên bản đồ"
                  checked={heatmapEnabled}
                  onChange={setHeatmapEnabled}
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  currentTheme={currentTheme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}