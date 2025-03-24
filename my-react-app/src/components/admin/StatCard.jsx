
import React from 'react';

const StatCard = ({ title, value, icon, change, changeType = 'increase' }) => {
  return (
    <div className="admin-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          
          {change && (
            <div className={`flex items-center mt-2 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
        
        <div className="bg-fitness-purple/10 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
