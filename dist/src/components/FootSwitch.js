import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
export const FootSwitch = ({ active, onToggle, momentary = false, className }) => {
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
    return (_jsx("button", { className: clsx('relative w-16 h-16 rounded-full', 'bg-gradient-to-b from-gray-300 to-gray-500', 'shadow-xl border-4 border-gray-700', 'transition-all duration-75', active ? 'translate-y-1 shadow-md' : 'hover:shadow-2xl', 'active:translate-y-2 active:shadow-sm', className), onClick: handleClick, onMouseDown: momentary ? handleMouseDown : undefined, onMouseUp: momentary ? handleMouseUp : undefined, onMouseLeave: momentary ? handleMouseUp : undefined, children: _jsx("div", { className: clsx('absolute inset-2 rounded-full', 'bg-gradient-to-b from-gray-400 to-gray-600', active && 'from-gray-500 to-gray-700') }) }));
};
