'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export const StatsCard = ({ title, value, icon, change, changeType }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="text-blue-600">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <span
            className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;