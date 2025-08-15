import React from 'react';

const AdminLogo = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-800 rounded-lg flex items-center justify-center shadow-lg`}>
      <div className="text-white font-bold text-xs">
        <div className="flex flex-col items-center">
          <span className="text-xs">AD</span>
          <span className="text-[8px]">MIN</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogo; 