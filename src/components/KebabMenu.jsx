import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Home, Calendar, Map, Info, Settings, X } from 'lucide-react';

export default function KebabMenu({ 
  onClick,
  position = 'top-right',
  style = {},
  className = '',
  size = 20,
  color = '#1565c0',
  ariaLabel = 'Open menu',
  setPage,
  openDetail,
  openSettings,
  currentTheme = {},
  primaryText = '#1565c0',
  isMenuOpen,
  setIsMenuOpen,
  minimal = false
}) {
  const menuRef = useRef(null);
  
  const positionClasses = {
    'top-right': 'top-8 right-5',
    'top-left': 'top-8 left-5',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const menuItems = [
    { 
      icon: Home, 
      label: 'Trang chủ', 
      action: () => { 
        if (setPage) setPage(0); 
        if (setIsMenuOpen) setIsMenuOpen(false); 
      } 
    },
    { 
      icon: Calendar, 
      label: 'Dự báo 7 ngày', 
      action: () => { 
        if (setPage) setPage(1); 
        if (setIsMenuOpen) setIsMenuOpen(false); 
      } 
    },
    { 
      icon: Map, 
      label: 'Bản đồ thời tiết', 
      action: () => { 
        if (setPage) setPage(2); 
        if (setIsMenuOpen) setIsMenuOpen(false); 
      } 
    },
    { 
      icon: Info, 
      label: 'Chi tiết thời tiết', 
      action: () => { 
        if (openDetail) openDetail(); 
        if (setIsMenuOpen) setIsMenuOpen(false); 
      } 
    },
    { 
      icon: Settings, 
      label: 'Cài đặt', 
      action: () => { 
        if (openSettings) openSettings(); 
        if (setIsMenuOpen) setIsMenuOpen(false); 
      } 
    },
  ];

  const handleClick = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
    if (onClick && !isMenuOpen) {
      onClick();
    }
  };

  return (
    <div 
      ref={menuRef}
      className={`absolute z-30 ${positionClasses[position] || positionClasses['top-right']} ${className}`}
    >
      <button
        onClick={handleClick}
        className={minimal ? "transition-all active:scale-95 hover:opacity-80" : "rounded-full p-2 transition-all hover:bg-white/10 active:scale-95"}
        style={{ 
          color: color,
          ...(minimal ? {
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            outline: 'none',
            boxShadow: 'none',
          } : {})
        }}
        aria-label={ariaLabel}
      >
        <MoreVertical size={size} strokeWidth={2} />
      </button>
    </div>
  );
}

export function MenuDrawer({
  isOpen,
  setIsOpen,
  setPage,
  openDetail,
  openSettings,
  primaryText = '#1565c0'
}) {
  const menuItems = [
    { 
      icon: Home, 
      label: 'Trang chủ', 
      action: () => { 
        if (setPage) setPage(0); 
        setIsOpen(false); 
      } 
    },
    { 
      icon: Calendar, 
      label: 'Dự báo 7 ngày', 
      action: () => { 
        if (setPage) setPage(1); 
        setIsOpen(false); 
      } 
    },
    { 
      icon: Map, 
      label: 'Bản đồ thời tiết', 
      action: () => { 
        if (setPage) setPage(2); 
        setIsOpen(false); 
      } 
    },
    { 
      icon: Info, 
      label: 'Chi tiết thời tiết', 
      action: () => { 
        if (openDetail) openDetail(); 
        setIsOpen(false); 
      } 
    },
    { 
      icon: Settings, 
      label: 'Cài đặt', 
      action: () => { 
        if (openSettings) openSettings(); 
        setIsOpen(false); 
      } 
    },
  ];

  return (
    <>
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(58, 141, 255, 0.15)',
        }}
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        className={`absolute inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
            Menu
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full transition-all active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0px 4px 12px rgba(58, 141, 255, 0.2)',
            }}
            aria-label="Đóng menu"
          >
            <X size={22} color="#1565c0" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-24 scrollbar-hide">
          <div className="p-6">
            <div className="space-y-2">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all active:scale-98"
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: primaryText,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}
                >
                  <item.icon size={20} color="#1565c0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
