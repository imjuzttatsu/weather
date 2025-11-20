import { CloudOff } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = CloudOff, 
  title = 'Không có dữ liệu', 
  description = 'Không có thông tin khả dụng',
  action,
  currentTheme
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="mb-6 opacity-40">
        <Icon size={80} strokeWidth={1.5} color={currentTheme?.accent || '#87CEEB'} />
      </div>
      
      <h3 
        className="text-2xl font-bold mb-3" 
        style={{ color: currentTheme?.text || '#2c5f7e' }}
      >
        {title}
      </h3>
      
      <p 
        className="text-base mb-8 max-w-xs leading-relaxed" 
        style={{ color: currentTheme?.textSecondary || '#5a7f9a' }}
      >
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${currentTheme?.accent || '#f6bc1a'} 0%, #f0a10c 100%)`,
            color: '#fff',
            boxShadow: `0 6px 20px ${currentTheme?.accent || '#f6bc1a'}40`
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}