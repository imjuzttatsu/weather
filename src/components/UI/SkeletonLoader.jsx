export function SkeletonCard({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-32 w-full bg-white/20 rounded-3xl mb-4"></div>
      <div className="h-4 w-28 bg-white/20 rounded-xl mb-3"></div>
      <div className="h-4 w-full bg-white/20 rounded-xl mb-3"></div>
      <div className="h-4 w-full bg-white/20 rounded-xl"></div>
    </div>
  );
}

export function SkeletonWeatherPanel() {
  const meshGradient = `
    radial-gradient(circle at 20% 30%, rgba(135, 206, 235, 0.7) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.65) 0%, transparent 50%),
    linear-gradient(180deg, rgba(135, 206, 235, 0.68) 0%, rgba(30, 144, 255, 0.7) 100%)
  `;

  const heroCardStyle = {
    background: meshGradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    marginLeft: '50px',
    marginRight: '50px',
    aspectRatio: '630 / 514',
    position: 'relative',
    paddingTop: '0px',
    paddingLeft: '2.5rem',
    border: 'none',
  };

  const metricsCardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    border: 'none',
  };

  return (
    <section
      className="flex flex-col h-full relative scrollbar-hide"
      style={{
        background: 'transparent',
        fontFamily: 'Open Sans, sans-serif',
        paddingTop: '100px',
        paddingBottom: '40px',
        overflowX: 'visible',
        overflowY: 'auto',
        marginLeft: '-20px',
        marginRight: '-20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <div
        className="absolute top-0 left-0 w-full flex flex-col items-center justify-center animate-pulse"
        style={{
          fontFamily: 'Open Sans, sans-serif',
          background: 'transparent',
          paddingTop: '2rem',
          paddingBottom: '1rem',
          zIndex: 30,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 bg-blue-500/30 rounded"></div>
          <div className="h-7 w-40 bg-blue-500/30 rounded"></div>
        </div>
        <div className="h-4 w-56 bg-gray-400/30 rounded">        </div>
      </div>

      <div style={heroCardStyle} className="mt-4 mb-3 animate-pulse">
        <div className="flex-shrink-0 relative flex items-center justify-center" style={{ width: '100%' }}>
          <div className="h-32 w-32 bg-white/30 rounded-full"></div>
        </div>
        <div
          className="absolute text-left"
          style={{
            bottom: '40px',
            left: '159px',
          }}
        >
          <div className="h-6 w-32 bg-white/30 rounded"></div>
        </div>
        <div
          className="absolute"
          style={{
            bottom: '-35px',
            left: '-44px',
          }}
        >
          <div className="w-48 h-48 bg-yellow-400/20 rounded-full"></div>
        </div>
      </div>

      <div style={{ marginLeft: '15px', marginRight: '15px' }} className="mb-2">
        <div style={metricsCardStyle} className="p-5 animate-pulse">
          <div className="flex items-center justify-between gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-6 h-6 bg-blue-500/30 rounded-full mb-2"></div>
                <div className="h-6 w-12 bg-gray-400/30 rounded mb-1"></div>
                <div className="h-4 w-20 bg-gray-400/30 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between mb-3" style={{ marginLeft: '15px', marginRight: '15px' }}>
          <div className="h-4 w-24 bg-gray-400/30 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3 overflow-x-auto" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div
              key={i}
              className="flex flex-col items-center flex-shrink-0 w-20 py-3 px-2 animate-pulse rounded-2xl"
              style={{
                background: 'rgba(135, 206, 235, 0.5)',
                backdropFilter: 'blur(15px)',
              }}
            >
              <div className="h-3 w-12 bg-white/30 rounded mb-2"></div>
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full mb-2"></div>
              <div className="h-4 w-10 bg-white/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}