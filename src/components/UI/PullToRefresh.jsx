import { useState, useRef, useEffect } from 'react';


const getResponsiveThreshold = () => {
  if (typeof window === 'undefined') return 80;
  const height = window.innerHeight;
  
  if (height < 600) return 60;
  
  if (height < 800) return 70;
  
  return 80;
};


const triggerHapticFeedback = (type = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    };
    navigator.vibrate(patterns[type] || 10);
  }
};

export default function PullToRefresh({ 
  onRefresh, 
  children, 
  disabled = false,
  threshold: customThreshold 
}) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);
  const threshold = useRef(customThreshold || getResponsiveThreshold());
  const hasTriggeredHaptic = useRef(false);


  useEffect(() => {
    const updateThreshold = () => {
      threshold.current = customThreshold || getResponsiveThreshold();
    };
    updateThreshold();
    window.addEventListener('resize', updateThreshold);
    return () => window.removeEventListener('resize', updateThreshold);
  }, [customThreshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e) => {
      if (container.scrollTop > 0) return; 
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
      hasTriggeredHaptic.current = false;
    };

    const handleTouchMove = (e) => {
      if (!isPulling || container.scrollTop > 0) return;
      
      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        const maxDistance = threshold.current * 2.5;
        setPullDistance(Math.min(distance, maxDistance));


        if (distance >= threshold.current && !hasTriggeredHaptic.current) {
          triggerHapticFeedback('medium');
          hasTriggeredHaptic.current = true;
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;


      const finalDistance = Math.max(0, currentY.current - startY.current);
      const shouldRefresh = finalDistance >= threshold.current;
      
      if (shouldRefresh && onRefresh) {
        triggerHapticFeedback('light');
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
      hasTriggeredHaptic.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, onRefresh, disabled]);

  const pullProgress = Math.min(pullDistance / threshold.current, 1);
  const shouldTrigger = pullDistance >= threshold.current;


  const getIndicatorStyle = () => {
    const opacity = Math.min(pullProgress * 1.5, 1);
    const scale = 0.8 + (pullProgress * 0.4); 
    const backgroundColor = shouldTrigger 
      ? 'rgba(21, 101, 192, 0.25)' 
      : `rgba(21, 101, 192, ${0.1 + pullProgress * 0.15})`;
    
    return {
      opacity,
      scale,
      backgroundColor
    };
  };

  const indicatorStyle = getIndicatorStyle();

  return (
    <div 
      ref={containerRef}
      className="scrollbar-hide"
      style={{ 
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'visible', 
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y' 
      }}
    >
      {}
      {(isPulling || isRefreshing) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${Math.max(pullDistance, 60)}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: indicatorStyle.backgroundColor,
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            transform: `translateY(${pullDistance - 60}px)`,
            transition: isRefreshing ? 'none' : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000,
            opacity: indicatorStyle.opacity
          }}
        >
          {isRefreshing ? (
            <div 
              className="flex items-center gap-3"
              style={{
                transform: `scale(${indicatorStyle.scale})`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <div 
                className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"
                style={{ borderWidth: '3px' }}
              ></div>
              <span 
                style={{ 
                  color: '#1565c0', 
                  fontSize: '15px',
                  fontWeight: '500',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                }}
              >
                Đang làm mới...
              </span>
            </div>
          ) : (
            <div 
              style={{
                transform: `rotate(${pullProgress * 360}deg) scale(${indicatorStyle.scale})`,
                transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: indicatorStyle.opacity
              }}
            >
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={shouldTrigger ? '#1565c0' : '#64B5F6'} 
                strokeWidth="2.5"
                style={{
                  filter: shouldTrigger ? 'drop-shadow(0 2px 4px rgba(21, 101, 192, 0.3))' : 'none'
                }}
              >
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </div>
          )}
        </div>
      )}
      
      {}
      <div style={{ paddingTop: isPulling || isRefreshing ? '60px' : '0' }}>
        {children}
      </div>
    </div>
  );
}
