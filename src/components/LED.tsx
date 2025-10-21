/**
 * LED indicator component
 */

import React from 'react';
import { clsx } from 'clsx';

interface LEDProps {
  active: boolean;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'white';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LED: React.FC<LEDProps> = ({
  active,
  color = 'red',
  size = 'medium',
  className
}) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const colorClasses = {
    red: 'bg-gray-600 shadow-gray-500/30',
    green: 'bg-gray-600 shadow-gray-500/30',
    blue: 'bg-gray-600 shadow-gray-500/30',
    yellow: 'bg-gray-600 shadow-gray-500/30',
    white: 'bg-gray-600 shadow-gray-500/30'
  };

  const activeColorClasses = {
    red: 'bg-red-400 shadow-red-300',
    green: 'bg-green-400 shadow-green-300',
    blue: 'bg-blue-400 shadow-blue-300',
    yellow: 'bg-yellow-300 shadow-yellow-200',
    white: 'bg-white shadow-white'
  };

  return (
    <div
      className={clsx(
        'rounded-full transition-all duration-200',
        sizeClasses[size],
        active ? activeColorClasses[color] : colorClasses[color],
        active && 'shadow-lg',
        className
      )}
      style={{
        boxShadow: active ? `0 0 12px rgba(248, 113, 113, 0.8), 0 0 24px rgba(248, 113, 113, 0.4)` : undefined
      }}
    />
  );
};
