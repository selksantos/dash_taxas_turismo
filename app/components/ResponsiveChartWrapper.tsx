'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
  icon: ReactNode;
  className?: string;
}

export function ResponsiveChartWrapper({ children, title, icon, className = '' }: Props) {

  return (
    <div className={`bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg ${className}`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <span className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
          {icon}
        </span>
        <span className="truncate">{title}</span>
      </h2>
      {children}
    </div>
  );
}