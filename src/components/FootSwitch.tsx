/**
 * Foot switch component for pedals
 */

import React from 'react';
import { clsx } from 'clsx';

interface FootSwitchProps {
  active: boolean;
  onToggle: () => void;
  momentary?: boolean;
  className?: string;
}

export const FootSwitch: React.FC<FootSwitchProps> = ({
  active,
  onToggle,
  momentary = false,
  className
}) => {
  const handleMouseDown = () => {
    if (momentary) {
      onToggle();
    }
  };

  const handleMouseUp = () => {
    if (momentary && active) {
      onToggle();
    }
  };

  const handleClick = () => {
    if (!momentary) {
      onToggle();
    }
  };

  return (
    <button
      className={clsx(
        'relative w-8 h-8 rounded-full', // w-16 h-16 -> w-8 h-8 (50% smaller)
        'bg-gradient-to-b from-gray-300 to-gray-500',
        'shadow-lg border-2 border-gray-700', // border-4 -> border-2, shadow-xl -> shadow-lg
        'transition-all duration-75',
        active ? 'translate-y-0.5 shadow-sm' : 'hover:shadow-xl', // translate-y-1 -> translate-y-0.5
        'active:translate-y-1 active:shadow-xs', // translate-y-2 -> translate-y-1
        className
      )}
      onClick={handleClick}
      onMouseDown={momentary ? handleMouseDown : undefined}
      onMouseUp={momentary ? handleMouseUp : undefined}
      onMouseLeave={momentary ? handleMouseUp : undefined}
    >
      <div className={clsx(
        'absolute inset-1 rounded-full', // inset-2 -> inset-1 for smaller button
        'bg-gradient-to-b from-gray-400 to-gray-600',
        active && 'from-gray-500 to-gray-700'
      )} />
    </button>
  );
};
