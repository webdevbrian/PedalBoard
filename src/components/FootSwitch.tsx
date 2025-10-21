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
        'relative w-16 h-16 rounded-full',
        'bg-gradient-to-b from-gray-300 to-gray-500',
        'shadow-xl border-4 border-gray-700',
        'transition-all duration-75',
        active ? 'translate-y-1 shadow-md' : 'hover:shadow-2xl',
        'active:translate-y-2 active:shadow-sm',
        className
      )}
      onClick={handleClick}
      onMouseDown={momentary ? handleMouseDown : undefined}
      onMouseUp={momentary ? handleMouseUp : undefined}
      onMouseLeave={momentary ? handleMouseUp : undefined}
    >
      <div className={clsx(
        'absolute inset-2 rounded-full',
        'bg-gradient-to-b from-gray-400 to-gray-600',
        active && 'from-gray-500 to-gray-700'
      )} />
    </button>
  );
};
