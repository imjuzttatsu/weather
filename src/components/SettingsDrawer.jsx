import { X } from 'lucide-react';
import ToggleSwitch from './Toggle3D.jsx';

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
}) {
  
  const newBlueGradient = 'linear-gradient(180deg, #A1C4FD 0%, #3A8DFF 100%)';
  const newBlueShadow = `
    0px 12px 30px rgba(58, 141, 255, 0.4),
    0px 4px 12px rgba(58, 141, 255, 0.25)
  `;
  
  return (
    <>
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 z-40 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(58, 141, 255, 0.15)',
        }}
        onClick={() => setIsDrawerOpen(false)}
      />
      
      <div 
        className={`absolute inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`} 
        style={{ 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `
            -10px 0 40px rgba(58, 141, 255, 0.2),
            -5px 0 20px rgba(58, 141, 255, 0.15)
          `,
        }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(58, 141, 255, 0.15)' }}>
          <h2 
            className="text-2xl font-bold" 
            style={{ 
              color: '#1565c0',
              fontFamily: 'Open Sans, sans-serif'
            }}
          >
            Cài đặt
          </h2>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full transition-all active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0px 4px 12px rgba(58, 141, 255, 0.2)',
            }}
            aria-label="Đóng cài đặt"
          >
            <X size={22} color="#1565c0" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-24 scrollbar-hide">
          <div className="space-y-6 p-6">

            <div>
              <h3 
                className="text-sm font-bold mb-3 uppercase tracking-wide" 
                style={{ 
                  color: '#1565c0',
                  fontFamily: 'Open Sans, sans-serif',
                  letterSpacing: '1px'
                }}
              >
                Giao diện
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setThemeMode('manual');
                    setIsDark(false);
                  }} 
                  className={`py-4 text-sm rounded-xl transition-all active:scale-95 ${
                    themeMode === 'manual' && !isDark ? 'font-bold' : 'font-medium'
                  }`}
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    background: themeMode === 'manual' && !isDark ? newBlueGradient : 'rgba(255, 255, 255, 0.5)',
                    color: themeMode === 'manual' && !isDark ? '#fff' : primaryText,
                    backdropFilter: 'blur(10px)',
                    border: themeMode === 'manual' && !isDark ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: themeMode === 'manual' && !isDark
                      ? newBlueShadow
                      : '0px 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  ☀️ Sáng
                </button>
                <button 
                  onClick={() => {
                    setThemeMode('manual');
                    setIsDark(true);
                  }} 
                  className={`py-4 text-sm rounded-xl transition-all active:scale-95 ${
                    themeMode === 'manual' && isDark ? 'font-bold' : 'font-medium'
                  }`}
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    background: themeMode === 'manual' && isDark ? newBlueGradient : 'rgba(255, 255, 255, 0.5)',
                    color: themeMode === 'manual' && isDark ? '#fff' : primaryText,
                    backdropFilter: 'blur(10px)',
                    border: themeMode === 'manual' && isDark ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: themeMode === 'manual' && isDark
                      ? newBlueShadow
                      : '0px 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  🌙 Tối
                </button>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(58, 141, 255, 0.15)' }} />

            <div className="flex items-center justify-between">
              <div>
                <span 
                  className="text-base font-semibold block mb-1" 
                  style={{ 
                    color: primaryText,
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  Âm thanh nền
                </span>
                <span 
                  className="text-sm" 
                  style={{ 
                    color: secondaryText,
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  Âm thanh thời tiết
                </span>
              </div>
              <ToggleSwitch 
                checked={soundEnabled} 
                onChange={setSoundEnabled} 
              />
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(58, 141, 255, 0.15)' }} />

            <div className="flex items-center justify-between">
              <div>
                <span 
                  className="text-base font-semibold block mb-1" 
                  style={{ 
                    color: primaryText,
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  Hiệu ứng chuyển động
                </span>
                <span 
                  className="text-sm" 
                  style={{ 
                    color: secondaryText,
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  Hoạt ảnh & chuyển cảnh
                </span>
              </div>
              <ToggleSwitch 
                checked={motionEnabled} 
                onChange={setMotionEnabled} 
              />
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(58, 141, 255, 0.15)' }} />

            <div>
              <h3 
                className="text-sm font-bold mb-3 uppercase tracking-wide" 
                style={{ 
                  color: '#1565c0',
                  fontFamily: 'Open Sans, sans-serif',
                  letterSpacing: '1px'
                }}
              >
                Đơn vị nhiệt độ
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setTempUnit('C')} 
                  className={`flex-1 py-3 rounded-xl transition-all active:scale-95 ${
                    tempUnit === 'C' ? 'font-bold' : 'font-medium'
                  }`}
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    background: tempUnit === 'C' ? newBlueGradient : 'rgba(255, 255, 255, 0.5)',
                    color: tempUnit === 'C' ? '#fff' : primaryText,
                    backdropFilter: 'blur(10px)',
                    border: tempUnit === 'C' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: tempUnit === 'C'
                      ? newBlueShadow
                      : '0px 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  °C
                </button>
                <button 
                  onClick={() => setTempUnit('F')} 
                  className={`flex-1 py-3 rounded-xl transition-all active:scale-95 ${
                    tempUnit === 'F' ? 'font-bold' : 'font-medium'
                  }`}
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    background: tempUnit === 'F' ? newBlueGradient : 'rgba(255, 255, 255, 0.5)',
                    color: tempUnit === 'F' ? '#fff' : primaryText,
                    backdropFilter: 'blur(10px)',
                    border: tempUnit === 'F' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: tempUnit === 'F'
                      ? newBlueShadow
                      : '0px 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  °F
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}