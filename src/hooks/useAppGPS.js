import { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/UI/Toast';


export function useAppGPS(settings, setSettings, currentLocationRef, fetchWeatherData) {
  const [gpsPermission, setGpsPermission] = useState(null);
  const [gpsWatchId, setGpsWatchId] = useState(null);
  const gpsUpdateTimeoutRef = useRef(null);
  const fetchWeatherDataRef = useRef(fetchWeatherData);
  const toast = useToast();


  useEffect(() => {
    fetchWeatherDataRef.current = fetchWeatherData;
  }, [fetchWeatherData]);

  const requestGPSPermission = async () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt của bạn không hỗ trợ GPS');
      return false;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setGpsPermission('granted');
      setSettings(prev => ({ ...prev, gpsEnabled: true }));
      
      const newLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        city: null
      };
      currentLocationRef.current = newLocation;
      
      await fetchWeatherData(null, position.coords.latitude, position.coords.longitude);
      toast.success('Đã bật GPS thành công');
      return true;
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        setGpsPermission('denied');
        toast.error('Bạn đã từ chối quyền truy cập GPS');
      } else {
        toast.error('Không thể lấy vị trí GPS');
      }
      setSettings(prev => ({ ...prev, gpsEnabled: false }));
      return false;
    }
  };

  const toggleGPS = async (enabled) => {
    if (enabled) {
      await requestGPSPermission();
    } else {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        setGpsWatchId(null);
      }
      if (gpsUpdateTimeoutRef.current) {
        clearTimeout(gpsUpdateTimeoutRef.current);
        gpsUpdateTimeoutRef.current = null;
      }
      setSettings(prev => ({ ...prev, gpsEnabled: false }));
      toast.info('Đã tắt GPS');
    }
  };


  useEffect(() => {
    if (!settings.gpsEnabled || gpsPermission !== 'granted') {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        setGpsWatchId(null);
      }
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;
        
        if (currentLocationRef.current) {
          const distance = Math.sqrt(
            Math.pow(newLat - currentLocationRef.current.lat, 2) + 
            Math.pow(newLon - currentLocationRef.current.lon, 2)
          ) * 111000;
          
          if (distance < 100) {
            return;
          }
        }

        const newLocation = {
          lat: newLat,
          lon: newLon,
          city: null
        };
        currentLocationRef.current = newLocation;
        
        if (gpsUpdateTimeoutRef.current) {
          clearTimeout(gpsUpdateTimeoutRef.current);
        }
        
        gpsUpdateTimeoutRef.current = setTimeout(() => {
          fetchWeatherDataRef.current(null, newLat, newLon, { preserveCity: false });
        }, 2000);
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error('GPS Error:', error);
        }
        if (error.code === error.PERMISSION_DENIED) {
          setGpsPermission('denied');
          setSettings(prev => ({ ...prev, gpsEnabled: false }));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    setGpsWatchId(watchId);

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (gpsUpdateTimeoutRef.current) {
        clearTimeout(gpsUpdateTimeoutRef.current);
      }
    };
    
  }, [settings.gpsEnabled, gpsPermission]); 

  return {
    gpsPermission,
    toggleGPS
  };
}
