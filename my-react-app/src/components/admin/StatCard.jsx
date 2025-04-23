import React from 'react';
import 'admin.css';

const StatCard = ({ title, value, icon, change, changeType = 'increase' }) => {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-content">
        <div className="admin-stat-info">
          <h3 className="admin-stat-title">{title}</h3>
          <p className="admin-stat-value">{value}</p>
          
          {change && (
            <div className={`admin-stat-change ${changeType === 'increase' ? 'increase' : 'decrease'}`}>
              <span>{change}</span>
            </div>
          )}
        </div>
        
        <div className="admin-stat-icon">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;