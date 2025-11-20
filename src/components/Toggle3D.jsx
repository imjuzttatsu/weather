import React from 'react';

export default function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div 
        className="relative"
        style={{
          width: '60px',
          height: '30px',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: `
            -8px -4px 8px 0px rgba(255, 255, 255, 0.8),
            8px 4px 12px 0px rgba(58, 141, 255, 0.3),
            4px 4px 4px 0px rgba(58, 141, 255, 0.15) inset,
            -4px -4px 4px 0px rgba(255, 255, 255, 0.8) inset
          `,
          transition: 'all 0.3s ease',
        }}
      >
        <div 
          style={{
            height: '100%',
            width: '200%',
            background: 'linear-gradient(180deg, #A1C4FD 0%, #3A8DFF 100%)',
            borderRadius: '15px',
            transform: checked ? 'translate3d(25%, 0, 0)' : 'translate3d(-75%, 0, 0)',
            transition: 'transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35)',
            boxShadow: `
              -8px -4px 8px 0px rgba(255, 255, 255, 0.5),
              8px 4px 12px 0px rgba(58, 141, 255, 0.4)
            `,
          }}
        />
      </div>
    </label>
  );
}