import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://weather-backend-vo7o.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }
    // Log error để debug trên mobile (không chỉ DEV mode)
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const weatherAPI = {
  getCurrentWeather: async (city = null, lat = null, lon = null) => {
    const params = {};
    if (city) params.city = city;
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    return api.get('/weather/current', { params });
  },

  getForecast: async (city = null, lat = null, lon = null, days = 7) => {
    const params = { days };
    if (city) params.city = city;
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    return api.get('/weather/forecast', { params });
  },

  getHourlyForecast: async (city = null, lat = null, lon = null, hours = 24) => {
    const params = { hours };
    if (city) params.city = city;
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    return api.get('/weather/hourly', { params });
  }
};

export const mapAPI = {
  searchLocation: async (query) => {
    return api.get('/map/search', { params: { q: query } });
  },

  reverseGeocode: async (lat, lon) => {
    return api.get('/map/reverse', { params: { lat, lon } });
  },

  getTemperatureGrid: async (params, signal) => {
    return api.get('/map/temperature-grid', { 
      params,
      timeout: 60000,
      signal: signal
    });
  }
};

export default api;
