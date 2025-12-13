// Simplified Vietnam border polygon (GeoJSON format)
// Chỉ lấy các điểm quan trọng để check nhanh
// Coordinates: [lng, lat] (longitude, latitude)

export const VIETNAM_BORDER_POLYGON = [
  [102.144, 22.496], // Tây Bắc (Điện Biên)
  [104.336, 22.767], // Lào Cai
  [106.715, 21.026], // Cao Bằng
  [107.973, 21.540], // Quảng Ninh
  [109.530, 21.125], // Hải Phòng (biển)
  [109.540, 16.058], // Đà Nẵng (biển)
  [108.366, 10.935], // Quy Nhơn (biển)
  [106.704, 8.634],  // Cà Mau
  [103.896, 9.125],  // Hà Tiên (biên giới Campuchia)
  [102.144, 22.496]  // Đóng polygon
];

/**
 * Point-in-polygon check (Ray casting algorithm)
 * Kiểm tra điểm có nằm trong polygon không
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True nếu điểm nằm trong polygon
 */
export function isPointInVietnam(lat, lng) {
  const polygon = VIETNAM_BORDER_POLYGON;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]; // [lng, lat]
    const xj = polygon[j][0], yj = polygon[j][1];
    
    // Ray casting: check intersection
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Simplified check - dùng bounding box trước, sau đó check polygon
 * Nhanh hơn cho grid lớn
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True nếu điểm nằm trong Việt Nam
 */
export function isPointInVietnamFast(lat, lng) {
  // Quick bounding box check trước (loại bỏ hầu hết điểm ngoài)
  if (lng < 102.1 || lng > 109.5 || lat < 8.6 || lat > 23.4) {
    return false;
  }
  
  // Check polygon nếu trong bounding box
  return isPointInVietnam(lat, lng);
}

