import React from 'react';
import { Home } from 'lucide-react';

const AdminLogo = ({ size = 'medium' }) => {
  const sizeConfig = {
    small: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-[8px]',
      subtitle: 'text-[6px]'
    },
    medium: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-xs',
      subtitle: 'text-[8px]'
    },
    large: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-sm',
      subtitle: 'text-xs'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.container} bg-orange-500 rounded flex items-center justify-center shadow-lg`}>
      <Home className={`${config.icon} text-white`} />
    </div>
  );
};

export default AdminLogo; 