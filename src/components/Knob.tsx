/**
 * Knob component for pedal controls
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  className?: string;
}

export const Knob: React.FC<KnobProps> = ({
  value,
  min = 0,
  max = 10,
  onChange,
  label,
  size = 'medium',
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const knobRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startValue = useRef(0);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = internalValue;
  }, [internalValue]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = startY.current - e.clientY;
    const range = max - min;
    const sensitivity = 200; // pixels for full range
    const deltaValue = (deltaY / sensitivity) * range;
    const newValue = Math.max(min, Math.min(max, startValue.current + deltaValue));
    
    setInternalValue(newValue);
    onChange(newValue);
  }, [isDragging, min, max, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rotation = ((internalValue - min) / (max - min)) * 270 - 135;
  
  const sizeClasses = {
    tiny: 'w-8 h-8',
    small: 'w-10 h-10',
    medium: 'w-14 h-14',
    large: 'w-20 h-20'
  };

  return (
    <div className={clsx(
      'flex flex-col items-center',
      size === 'tiny' ? 'gap-1' : 'gap-2',
      className
    )}>
      <div
        ref={knobRef}
        className={clsx(
          'relative rounded-full bg-gradient-to-b from-gray-700 to-gray-900',
          'shadow-lg cursor-grab active:cursor-grabbing',
          'border-2 border-gray-600',
          sizeClasses[size],
          isDragging && 'ring-2 ring-blue-400'
        )}
        onMouseDown={handleMouseDown}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1/3 bg-white rounded-full" />
      </div>
      {label && (
        <div className={clsx(
          'text-gray-300 font-medium uppercase tracking-wider',
          size === 'tiny' ? 'text-xs' : 'text-xs'
        )}>
          {label}
        </div>
      )}
      <div className={clsx(
        'text-gray-400',
        size === 'tiny' ? 'text-xs' : 'text-xs'
      )}>
        {internalValue.toFixed(size === 'tiny' ? 0 : 1)}
      </div>
    </div>
  );
};
