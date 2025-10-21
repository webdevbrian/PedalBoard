/**
 * Pedal component - visual representation of a guitar pedal
 */

import React from 'react';
import { clsx } from 'clsx';
import { Knob } from './Knob';
import { FootSwitch } from './FootSwitch';
import { LED } from './LED';
import { Box } from '../pedals/Box';

interface PedalProps {
  pedal: Box;
  color?: string;
  className?: string;
}

export const Pedal: React.FC<PedalProps> = ({
  pedal,
  color = 'bg-gradient-to-b from-red-600 to-red-800',
  className
}) => {
  const [bypassed, setBypassed] = React.useState(pedal.isBypassed());
  const [potValues, setPotValues] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Initialize pot values
    const values: Record<string, number> = {};
    pedal.pots.forEach(pot => {
      values[pot.getName()] = pot.getValue();
    });
    setPotValues(values);

    // Listen for bypass changes
    const handleBypassChange = (state: boolean) => {
      setBypassed(!state);
    };
    
    pedal.bypassSwitch.on('change', handleBypassChange);
    
    return () => {
      pedal.bypassSwitch.off('change', handleBypassChange);
    };
  }, [pedal]);

  const handleBypassToggle = () => {
    pedal.toggleBypass();
    setBypassed(pedal.isBypassed());
  };

  const handlePotChange = (potName: string, value: number) => {
    const pot = pedal.pots.find(p => p.getName() === potName);
    if (pot) {
      pot.setActualValue(value);
      setPotValues(prev => ({ ...prev, [potName]: value }));
    }
  };

  // Get pedal-specific configuration
  const getPedalColor = () => {
    switch (pedal.name) {
      case 'overdrive':
        return 'bg-gradient-to-b from-yellow-600 to-yellow-800';
      case 'delay':
        return 'bg-gradient-to-b from-blue-600 to-blue-800';
      case 'reverb':
        return 'bg-gradient-to-b from-purple-600 to-purple-800';
      case 'volume':
        return 'bg-gradient-to-b from-gray-600 to-gray-800';
      case 'cabinet':
        return 'bg-gradient-to-b from-green-600 to-green-800';
      default:
        return color;
    }
  };

  const getPedalTitle = () => {
    return pedal.name.charAt(0).toUpperCase() + pedal.name.slice(1);
  };

  const truncateLabel = (label: string, maxLength: number = 6) => {
    if (label.length <= maxLength) return label;
    return label.substring(0, maxLength);
  };

  // Calculate number of rows based on knob count
  const getKnobRows = () => {
    // Volume pedal (1 knob) should have same height as 2-row pedals
    if (pedal.pots.length === 1) return 2;
    if (pedal.pots.length <= 2) return 1;
    if (pedal.pots.length <= 4) return 2;
    if (pedal.pots.length === 5) return 3; // 2x2 + 1 centered
    return Math.ceil(pedal.pots.length / 3); // 3 columns for 6+
  };

  // Calculate height based on rows: base height + (rows * row height)
  const getHeight = () => {
    const baseHeight = 150; // Base height increased by 30px (120 + 30)
    const rowHeight = 60; // Height per row scaled down by 25% (80 * 0.75)
    const rows = getKnobRows();
    return baseHeight + (rows * rowHeight);
  };

  return (
    <div
      className={clsx(
        'relative w-40 rounded-lg p-3', // w-36 -> w-40 (10% wider)
        'shadow-2xl border-2 border-gray-900',
        getPedalColor(),
        className
      )}
      style={{ height: `${getHeight()}px` }}
    >
      {/* Pedal Title */}
      <div className="text-center mb-3">
        <h3 className="text-white font-bold text-base uppercase tracking-wider">
          {getPedalTitle()}
        </h3>
      </div>

      {/* Knobs */}
      <div className={clsx(
        'gap-1.5',
        pedal.pots.length === 1 ? 'flex justify-center mb-6' : // Center single knob
        pedal.pots.length <= 2 ? 'grid grid-cols-2 mb-6' :
        pedal.pots.length <= 4 ? 'grid grid-cols-2 mb-4' :
        pedal.pots.length === 5 ? 'grid grid-cols-2 mb-3' :
        'grid grid-cols-3 mb-3'
      )}>
        {pedal.pots.map((pot, index) => {
          // For 5-knob pedals, put the 5th knob in the center of the third row
          const shouldSpanCols = pedal.pots.length === 5 && index === 4;
          
          return (
            <div
              key={pot.getName()}
              className={shouldSpanCols ? 'col-span-2 flex justify-center' : ''}
            >
              <Knob
                value={potValues[pot.getName()] || pot.getValue()}
                min={pot.getConfig().min}
                max={pot.getConfig().max}
                onChange={(value) => handlePotChange(pot.getName(), value)}
                label={truncateLabel(pot.getName())}
                size={pedal.pots.length > 4 ? "tiny" : "small"}
              />
            </div>
          );
        })}
      </div>

      {/* LED and Foot Switch */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ bottom: '11px' }}> {/* bottom: '-4px' -> bottom: '11px' (15px higher) */}
        <LED active={!bypassed} color="red" />
        <FootSwitch
          active={!bypassed}
          onToggle={handleBypassToggle}
        />
      </div>

      {/* Decorative screws */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-400" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-400" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-400" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-400" />
    </div>
  );
};
