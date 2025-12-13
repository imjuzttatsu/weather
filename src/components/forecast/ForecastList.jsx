import React from 'react';
import { DailyForecastItem } from '../weather';


export default function ForecastList({
  filteredForecast = [],
  selectedDayIndex = 0,
  setSelectedDayIndex,
  onDayClick,
  convertTemp,
  secondaryText,
  primaryText,
}) {
  // Collect all temperatures for gradient calculation
  const allTemps = filteredForecast.flatMap(day => [day.tempMin, day.temp]);
  
  return (
    <div 
      className="flex-1 overflow-y-auto scrollbar-hide"
      style={{
        padding: 'clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 3vw, 2rem)',
        paddingTop: 'clamp(0.25rem, 1vh, 0.5rem)',
      }}
    >
      {filteredForecast.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: secondaryText }}>Đang tải dữ liệu dự báo...</p>
        </div>
      ) : (
        <div 
          className="space-y-1" 
          style={{ 
            paddingTop: 'clamp(0.5rem, 1.5vh, 1rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1.5vh, 0.75rem)', // Giảm spacing giữa các thẻ
          }}
        >
          {filteredForecast.map((day, i) => (
            <DailyForecastItem
              key={i}
              day={day.day}
              icon={day.icon}
              desc={day.desc}
              temp={day.temp}
              tempMin={day.tempMin}
              allTemps={allTemps}
              isSelected={i === selectedDayIndex}
              onClick={() => {
                setSelectedDayIndex(i);
                if (onDayClick) {
                  onDayClick(filteredForecast[i]);
                }
              }}
              convertTemp={convertTemp}
              primaryText={primaryText}
              secondaryText={secondaryText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
