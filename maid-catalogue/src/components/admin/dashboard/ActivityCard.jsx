import React from 'react';
import { Activity, Clock } from 'lucide-react';

const ActivityCard = ({ 
  title = "Recent Activity", 
  activities = [], 
  loading = false,
  color = '#ff914d' 
}) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      maid_added: Activity,
      user_registered: Activity,
      recommendations_made: Activity,
      maids_employed: Activity,
      default: Clock
    };
    
    return iconMap[type] || iconMap.default;
  };

  const formatActivityText = (activity) => {
    const typeMap = {
      maid_added: 'maid profiles added',
      user_registered: 'new user registrations',
      recommendations_made: 'recommendations created',
      maids_employed: 'maids hired',
      default: 'system activities'
    };
    
    const actionText = typeMap[activity.type] || typeMap.default;
    return `${activity.count} ${actionText} ${activity.timeframe}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5" style={{ color: color }} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            
            return (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div 
                  className="p-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <IconComponent className="w-4 h-4" style={{ color: color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-tight">
                    <span className="font-medium">{activity.count}</span>{' '}
                    <span>{formatActivityText(activity).substring(activity.count.toString().length + 1)}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">
                    {activity.timeframe}
                  </p>
                </div>
                {activity.trending && (
                  <div className="flex-shrink-0">
                    <span className="text-xs text-green-600 font-medium">↑ {activity.trending}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            View all activity →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;