import React, { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';

/**
 * Apple Weather-style Heatmap Layer
 * Sử dụng Mapbox native heatmap với cấu hình màu mượt mà giống Apple Weather
 * 
 * Các điểm quan trọng:
 * - Radius lớn (60px) để tạo hiệu ứng loang mượt
 * - Color gradient 6 stops từ Xanh (lạnh) -> Cam -> Đỏ (nóng)
 * - Opacity 0.7 để nhìn thấy map bên dưới
 * - Dark map style bắt buộc để heatmap nổi bật
 */
export default function WeatherHeatmap({ points = [], enabled = true, type = 'temperature' }) {
  const sourceId = 'weather-heatmap-data';
  const layerId = 'weather-heatmap-layer';

  // Chuyển đổi points thành GeoJSON format với property 'mag' (0-1)
  const geojsonData = useMemo(() => {
    if (!points || points.length === 0) return null;

    const features = points.map(point => {
      // Lấy giá trị dựa trên type và normalize về 0-1
      let mag = 0;
      
      // CHỈ GIỮ LẠI TEMPERATURE
      // Normalize temperature CHÍNH XÁC theo Apple Weather
      // Range: -10°C đến 45°C = 55°C range
      const temp = point.temperature || 25;
      
      // Formula: (temp + 10) / 55
      // 18°C: (18 + 10) / 55 = 28/55 = 0.5091 ≈ 0.51
      mag = Math.max(0, Math.min(1, (temp + 10) / 55));

      return {
        type: 'Feature',
        properties: {
          mag: mag // Giá trị 0-1 để control heatmap weight
        },
        geometry: {
          type: 'Point',
          coordinates: [
            point.lng || point.longitude || point.lon,
            point.lat || point.latitude
          ]
        }
      };
    }).filter(f => 
      f.geometry.coordinates[0] && 
      f.geometry.coordinates[1] && 
      !isNaN(f.properties.mag)
    );

    return {
      type: 'FeatureCollection',
      features: features
    };
  }, [points, type]);

  // Cấu hình màu - CHỈ TEMPERATURE (Apple Weather style)
  const colorStops = useMemo(() => {
    // Nhiệt độ: Xanh (lạnh) -> Cyan -> Vàng -> Cam -> Đỏ (nóng)
    // Mapping CHÍNH XÁC theo mag value:
    // mag=0.0 = -10°C → Xanh dương đậm
    // mag=0.18 = 0°C → Xanh dương nhạt
    // mag=0.36 = 10°C → Cyan
    // mag=0.51 = 18°C → Cyan nhạt (MÁT - Hà Nội) ✅
    // mag=0.64 = 25°C → Vàng nhạt (Ấm)
    // mag=0.73 = 30°C → Vàng
    // mag=0.82 = 35°C → Cam
    // mag=0.91 = 40°C → Cam đậm
    // mag=1.0 = 45°C → Đỏ đậm
    return [
      0, 'rgba(33,102,172,0)',      // Trong suốt ở rìa
      0.05, 'rgba(33,102,172,0.5)', // Bắt đầu hiện (-7°C)
      0.1, 'rgba(67,147,195,0.7)',  // Xanh dương (-3°C)
      0.18, 'rgb(103,169,207)',     // Xanh nhạt (0°C - Lạnh)
      0.30, 'rgb(136,189,214)',     // Xanh cyan (7°C)
      0.36, 'rgb(175,215,235)',     // Cyan (10°C)
      0.45, 'rgb(200,228,245)',     // Cyan nhạt (15°C)
      0.51, 'rgb(209,229,240)',     // Cyan rất nhạt (18°C - MÁT) ✅
      0.58, 'rgb(220,238,250)',     // Cyan-xanh lá (20°C)
      0.64, 'rgb(255,250,200)',     // Vàng nhạt (25°C - Ấm)
      0.73, 'rgb(255,235,150)',     // Vàng (30°C - Ấm)
      0.82, 'rgb(253,219,199)',     // Cam nhạt (35°C - Nóng)
      0.87, 'rgb(244,165,130)',     // Cam (37°C)
      0.91, 'rgb(239,138,98)',      // Cam đậm (40°C - Rất nóng)
      0.95, 'rgb(215,48,39)',       // Đỏ cam (42°C)
      0.98, 'rgb(200,20,30)',       // Đỏ (43°C)
      1, 'rgb(178,24,43)'           // Đỏ đậm (45°C - Cực nóng)
    ];
  }, []);

  if (!enabled || !geojsonData || geojsonData.features.length === 0) {
    return null;
  }

  return (
    <Source id={sourceId} type="geojson" data={geojsonData}>
      <Layer
        id={layerId}
        type="heatmap"
        paint={{
          // Weight: CHÍNH XÁC - map trực tiếp từ mag nhưng scale xuống để tránh density tích lũy
          // 18°C (mag=0.51) → weight khoảng 0.35-0.4 để hiện đúng màu cyan
          'heatmap-weight': [
            'interpolate', ['linear'], ['get', 'mag'],
            0, 0,        // -10°C: weight 0
            0.18, 0.15,  // 0°C: weight 0.15
            0.36, 0.28,  // 10°C: weight 0.28
            0.51, 0.38,  // 18°C: weight 0.38 (đủ để hiện màu cyan, không quá cao)
            0.64, 0.48,  // 25°C: weight 0.48
            0.73, 0.55,  // 30°C: weight 0.55
            0.82, 0.62,  // 35°C: weight 0.62
            0.91, 0.68,  // 40°C: weight 0.68
            1, 0.75      // 45°C: weight 0.75 (max, không phải 1.0 để tránh density quá cao)
          ],
          
          // Intensity: ĐIỀU CHỈNH cho zoom 8-10 để phù hợp với radius lớn
          // Khi zoom gần: tăng intensity để heatmap rõ hơn
          // Khi zoom xa: giảm intensity để không quá đậm
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            4, 0.5,    // Zoom xa (4): intensity thấp (giảm từ 0.6)
            6, 0.8,    // Zoom xa-trung bình (6): tăng (giảm từ 1.0)
            8, 1.2,    // Zoom trung bình (8): vừa (giảm từ 1.5 vì radius đã lớn)
            9, 1.4,    // Zoom 9: vừa
            10, 1.6,   // Zoom gần (10): cao (giảm từ 2.0 vì radius đã lớn)
            12, 2.0,   // Zoom rất gần (12): rất cao (giảm từ 2.5)
            14, 2.4,   // Zoom cực gần (14): cao (giảm từ 3.0)
            16, 2.8    // Zoom max (16): max (giảm từ 3.5)
          ],
          
          // Color gradient - APPLE WEATHER EXACT STYLE
          // Gradient mượt với nhiều color stops để không bị đốm cục
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            ...colorStops
          ],
          
          // Radius: TĂNG LÊN để phủ khắp và blend mượt hơn
          // Khi zoom gần: radius lớn hơn để mượt hơn
          // Khi zoom xa: radius nhỏ hơn để không quá loang
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 50,     // Zoom xa (4): radius nhỏ (tăng từ 30)
            6, 100,    // Zoom xa-trung bình (6): tăng (tăng từ 60)
            8, 250,    // Zoom trung bình (8): lớn (TĂNG từ 100 → 250px)
            9, 300,    // Zoom 9: lớn hơn (TĂNG)
            10, 350,   // Zoom gần (10): rất lớn (TĂNG từ 140 → 350px)
            12, 400,   // Zoom rất gần (12): rất lớn (tăng từ 180)
            14, 450,   // Zoom cực gần (14): cực lớn (tăng từ 220)
            16, 500    // Zoom max (16): max (tăng từ 260)
          ],
          
          // Opacity: THAY ĐỔI THEO ZOOM
          // Khi zoom gần: opacity cao hơn để rõ hơn
          // Khi zoom xa: opacity thấp hơn để nhẹ nhàng
          'heatmap-opacity': [
            'interpolate', ['linear'], ['zoom'],
            4, 0.4,    // Zoom xa (4): opacity thấp
            6, 0.5,    // Zoom xa-trung bình (6): tăng
            8, 0.6,    // Zoom trung bình (8): vừa
            10, 0.7,   // Zoom gần (10): cao (Apple Weather style)
            12, 0.75,  // Zoom rất gần (12): rất cao
            14, 0.8,   // Zoom cực gần (14): cao
            16, 0.85   // Zoom max (16): max
          ]
        }}
      />
    </Source>
  );
}

