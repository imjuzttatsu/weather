module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'rotate': 'rotate 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'slideUp': 'slideUp 0.5s ease forwards',
        'scaleUp': 'scaleUp 0.4s ease forwards',
        'fadeIn': 'fadeIn 0.6s ease forwards'
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        scaleUp: {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
};
