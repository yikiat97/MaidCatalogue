import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  color = '#ff914d',
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="p-2 rounded-lg transition-all duration-200 group-hover:scale-105"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 mb-1">{title}</p>
          <p className="text-sm text-gray-500 leading-tight">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );
};

export default QuickActionCard;