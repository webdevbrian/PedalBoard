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

  return (
    <div
      className={clsx(
        'relative w-48 h-64 rounded-lg p-4',
        'shadow-2xl border-2 border-gray-900',
        getPedalColor(),
        className
      )}
    >
      {/* Pedal Title */}
      <div className="text-center mb-4">
        <h3 className="text-white font-bold text-lg uppercase tracking-wider">
          {getPedalTitle()}
        </h3>
      </div>

      {/* Knobs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {pedal.pots.map((pot, index) => (
          <Knob
            key={pot.getName()}
            value={potValues[pot.getName()] || pot.getValue()}
            min={pot.getConfig().min}
            max={pot.getConfig().max}
            onChange={(value) => handlePotChange(pot.getName(), value)}
            label={pot.getName()}
            size="small"
          />
        ))}
      </div>

      {/* LED and Foot Switch */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
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
