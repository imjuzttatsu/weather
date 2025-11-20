import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle size={22} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.4)'
    },
    error: {
      icon: <AlertCircle size={22} />,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      shadow: 'rgba(239, 68, 68, 0.4)'
    },
    info: {
      icon: <Info size={22} />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      shadow: 'rgba(59, 130, 246, 0.4)'
    }
  };

  const current = config[type];

  return (
    <div 
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown"
      style={{
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <div 
        className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl min-w-[320px] max-w-md backdrop-blur-lg"
        style={{
          background: current.gradient,
          boxShadow: `0 8px 24px ${current.shadow}`,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="text-white flex-shrink-0">
          {current.icon}
        </div>
        <p className="text-white font-medium flex-1 text-sm">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    window.showToast = showToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

export function useToast() {
  return {
    success: (msg) => window.showToast?.(msg, 'success'),
    error: (msg) => window.showToast?.(msg, 'error'),
    info: (msg) => window.showToast?.(msg, 'info')
  };
}