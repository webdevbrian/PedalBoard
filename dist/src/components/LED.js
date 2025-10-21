import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
export const LED = ({ active, color = 'red', size = 'medium', className }) => {
    const sizeClasses = {
        small: 'w-2 h-2',
        medium: 'w-3 h-3',
        large: 'w-4 h-4'
    };
    const colorClasses = {
        red: 'bg-red-600 shadow-red-500/50',
        green: 'bg-green-600 shadow-green-500/50',
        blue: 'bg-blue-600 shadow-blue-500/50',
        yellow: 'bg-yellow-500 shadow-yellow-400/50',
        white: 'bg-white shadow-white/50'
    };
    const activeColorClasses = {
        red: 'bg-red-500 shadow-red-400 animate-pulse',
        green: 'bg-green-500 shadow-green-400 animate-pulse',
        blue: 'bg-blue-500 shadow-blue-400 animate-pulse',
        yellow: 'bg-yellow-400 shadow-yellow-300 animate-pulse',
        white: 'bg-white shadow-white animate-pulse'
    };
    return (_jsx("div", { className: clsx('rounded-full transition-all duration-200', sizeClasses[size], active ? activeColorClasses[color] : colorClasses[color], active && 'shadow-lg', className), style: {
            boxShadow: active ? `0 0 20px currentColor` : undefined
        } }));
};
