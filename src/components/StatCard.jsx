import React from 'react';

export default function StatCard({ label, value, icon, bgColor = 'bg-white' }) {
  return (
    <div className={`${bgColor} rounded-lg shadow p-6 flex items-center space-x-4`}>
      {icon && (
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/50 text-2xl">
          {icon}
        </span>
      )}
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}