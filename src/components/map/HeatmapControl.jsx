import React from 'react';
import { Layers } from 'lucide-react';

/**
 * Custom Mapbox Control cho Heatmap Toggle
 * Hiển thị như một control trong map (giống zoom, compass controls)
 */
export default class HeatmapControl {
  constructor({ heatmapEnabled, onToggle }) {
    this.heatmapEnabled = heatmapEnabled;
    this.onToggle = onToggle;
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.style.cssText = `
      margin: 10px;
      background: ${this.heatmapEnabled 
        ? 'rgba(21, 101, 192, 0.2)' 
        : 'rgba(255, 255, 255, 0.95)'};
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 2px solid ${this.heatmapEnabled ? '#1565c0' : 'rgba(21, 101, 192, 0.3)'};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
      min-width: 120px;
    `;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mapboxgl-ctrl-icon';
    button.style.cssText = `
      width: 100%;
      padding: 10px 14px;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      color: #1565c0;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Open Sans', sans-serif;
      white-space: nowrap;
    `;
    
    button.onmouseover = () => {
      button.style.opacity = '0.8';
    };
    button.onmouseout = () => {
      button.style.opacity = '1';
    };
    
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.onToggle) {
        this.onToggle();
      }
    };

    // Tạo icon và text
    const iconWrapper = document.createElement('div');
    iconWrapper.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    // Icon SVG (Layers icon)
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('width', '20');
    iconSvg.setAttribute('height', '20');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', '#1565c0');
    iconSvg.setAttribute('stroke-width', '2');
    iconSvg.setAttribute('stroke-linecap', 'round');
    iconSvg.setAttribute('stroke-linejoin', 'round');
    
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M12 2L2 7l10 5 10-5-10-5z');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M2 17l10 5 10-5M2 12l10 5 10-5');
    
    iconSvg.appendChild(path1);
    iconSvg.appendChild(path2);
    
    // Logic đảo: khi đang ở heatmap thì hiển thị "Bản đồ" (click để chuyển sang bản đồ)
    // Khi đang ở bản đồ thì hiển thị "Heatmap" (click để chuyển sang heatmap)
    const text = document.createTextNode(this.heatmapEnabled ? 'Bản đồ' : 'Heatmap');
    const textSpan = document.createElement('span');
    textSpan.appendChild(text);
    textSpan.style.cssText = 'user-select: none; white-space: nowrap;';

    iconWrapper.appendChild(iconSvg);
    iconWrapper.appendChild(textSpan);
    button.appendChild(iconWrapper);
    
    this.button = button;
    this.textSpan = textSpan;
    this.container.appendChild(button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = null;
  }

  updateState(heatmapEnabled) {
    this.heatmapEnabled = heatmapEnabled;
    if (this.container && this.textSpan) {
      // Update background
      this.container.style.background = heatmapEnabled 
        ? 'rgba(21, 101, 192, 0.2)' 
        : 'rgba(255, 255, 255, 0.95)';
      this.container.style.border = `2px solid ${heatmapEnabled ? '#1565c0' : 'rgba(21, 101, 192, 0.3)'}`;
      
      // Update text - Logic đảo: khi đang ở heatmap thì hiển thị "Bản đồ"
      this.textSpan.textContent = heatmapEnabled ? 'Bản đồ' : 'Heatmap';
    }
  }
}

