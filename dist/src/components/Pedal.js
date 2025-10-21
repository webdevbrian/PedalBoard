import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Pedal component - visual representation of a guitar pedal
 */
import React from 'react';
import { clsx } from 'clsx';
import { Knob } from './Knob';
import { FootSwitch } from './FootSwitch';
import { LED } from './LED';
export const Pedal = ({ pedal, color = 'bg-gradient-to-b from-red-600 to-red-800', className }) => {
    const [bypassed, setBypassed] = React.useState(pedal.isBypassed());
    const [potValues, setPotValues] = React.useState({});
    React.useEffect(() => {
        // Initialize pot values
        const values = {};
        pedal.pots.forEach(pot => {
            values[pot.getName()] = pot.getValue();
        });
        setPotValues(values);
        // Listen for bypass changes
        const handleBypassChange = (state) => {
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
    const handlePotChange = (potName, value) => {
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
    return (_jsxs("div", { className: clsx('relative w-48 h-64 rounded-lg p-4', 'shadow-2xl border-2 border-gray-900', getPedalColor(), className), children: [_jsx("div", { className: "text-center mb-4", children: _jsx("h3", { className: "text-white font-bold text-lg uppercase tracking-wider", children: getPedalTitle() }) }), _jsx("div", { className: "grid grid-cols-2 gap-4 mb-8", children: pedal.pots.map((pot) => (_jsx(Knob, { value: potValues[pot.getName()] || pot.getValue(), min: pot.getConfig().min, max: pot.getConfig().max, onChange: (value) => handlePotChange(pot.getName(), value), label: pot.getName(), size: "small" }, pot.getName()))) }), _jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2", children: [_jsx(LED, { active: !bypassed, color: "red" }), _jsx(FootSwitch, { active: !bypassed, onToggle: handleBypassToggle })] }), _jsx("div", { className: "absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-400" }), _jsx("div", { className: "absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-400" }), _jsx("div", { className: "absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-400" }), _jsx("div", { className: "absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-400" })] }));
};
