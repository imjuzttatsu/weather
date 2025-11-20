import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 py-3 px-4 flex items-center justify-center gap-3 animate-slideDown"
      style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
      }}
    >
      <WifiOff size={20} className="text-white" />
      <span className="text-white font-semibold text-sm">
        Không có kết nối Internet
      </span>
    </div>
  );
}