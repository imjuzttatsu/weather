import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{
            background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 50%, #FFFFFF 100%)'
          }}
        >
          <div className="text-center max-w-md">
            <div className="mb-6 flex justify-center">
              <AlertTriangle size={80} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#2c5f7e' }}>
              Oops! Có lỗi xảy ra
            </h2>
            <p className="text-base mb-8" style={{ color: '#5a7f9a' }}>
              Ứng dụng gặp lỗi không mong muốn. Vui lòng tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="neo-button-blue px-8 py-4 rounded-2xl font-bold"
            >
              Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;