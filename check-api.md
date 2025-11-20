# Hướng dẫn kiểm tra API Calls

## 1. Kiểm tra Backend Server

### Kiểm tra server có đang chạy:
```bash
# Trong thư mục pleasant-backend
npm start
```

### Kiểm tra health:
- Mở browser: `http://localhost:5000/health`
- Hoặc: `http://localhost:5000/api/test`

## 2. Kiểm tra Rate Limit

### Xem rate limit status:
- Mở browser: `http://localhost:5000/api/ratelimit`
- Hoặc check headers trong Network tab:
  - `X-RateLimit-Limit`: Giới hạn tối đa (100)
  - `X-RateLimit-Remaining`: Số requests còn lại
  - `X-RateLimit-Reset`: Thời gian reset (timestamp)

### Rate Limit hiện tại:
- **Max**: 100 requests
- **Window**: 15 phút
- **Reset**: Tự động sau 15 phút

## 3. Kiểm tra Logs

### Backend logs sẽ hiển thị:
```
[2024-01-01T10:00:00.000Z] GET /api/weather/current?city=Ho%20Chi%20Minh
[WEATHER] Request for city: Ho Chi Minh, lat: undefined, lon: undefined
[WEATHER] Geocoding city: Ho Chi Minh
[WEATHER] Geocoded to: Ho Chi Minh City (10.8231, 106.6297)
[WEATHER] Fetching weather for: 10.8231, 106.6297
[OPEN-METEO] Fetching weather for lat: 10.8231, lon: 106.6297
[OPEN-METEO] Weather code: 3, Condition: Overcast, Temp: 24°C
[WEATHER] Weather code received: 3, condition: Overcast
```

### Frontend logs sẽ hiển thị:
```
[ICON MAP] Overcast (code 3) mapped to icon 1 (Partly Cloudy)
[MAIN] Raw weatherCode: 3, Mapped to: 1
[PREVIEW] Location: Ho Chi Minh City, Raw weatherCode: 3, Mapped to icon: 1, Condition: Overcast
```

## 4. Kiểm tra Weather Code Mapping

### Weather Code từ Open-Meteo (WMO):
- `0`: Clear sky → Icon 0 (Sunny)
- `1`: Mainly clear → Icon 1 (Partly Cloudy)
- `2`: Partly cloudy → Icon 1 (Partly Cloudy)
- `3`: **Overcast** → Icon 1 (Partly Cloudy) ⚠️
- `45, 48`: Foggy → Icon 1 (Partly Cloudy)
- `51-55, 61, 80`: Light rain → Icon 3 (Rain)
- `63, 65, 81, 82`: Heavy rain → Icon 3 (Rain)
- `71-77, 85, 86`: Snow → Icon 5 (Sun Shower)
- `95, 96, 99`: Thunderstorm → Icon 4 (Thunderstorm)

### Vấn đề với Hồ Chí Minh:
- Nếu weather code là `3` (Overcast), nó sẽ map sang icon `1` (Partly Cloudy)
- Icon có thể không phù hợp với "Overcast" (u ám)
- Có thể cần icon riêng cho Overcast hoặc dùng icon khác

## 5. Debug trong Browser

### Mở Developer Tools (F12):
1. **Console tab**: Xem logs từ frontend
2. **Network tab**: 
   - Xem API requests
   - Check status code (200 = OK, 404 = Not Found, 429 = Rate Limited)
   - Xem response data
   - Check headers (X-RateLimit-*)

### Kiểm tra API response:
```javascript
// Trong Console
fetch('http://localhost:5000/api/weather/current?city=Ho%20Chi%20Minh')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

## 6. Giải quyết vấn đề

### Nếu gặp lỗi 404:
- Kiểm tra backend server có đang chạy không
- Kiểm tra route có đúng không (`/api/map/search`)
- Kiểm tra port có đúng không (5000)

### Nếu gặp lỗi 429 (Rate Limited):
- Đợi 15 phút để reset
- Hoặc tăng `max` trong `server.js` (không khuyến khích)

### Nếu icon sai:
- Check weather code trong console logs
- Check mapping function `mapWeatherCodeToIcon`
- Có thể cần thêm icon mới cho Overcast

