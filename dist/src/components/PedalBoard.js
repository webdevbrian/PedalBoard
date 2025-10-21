import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * PedalBoard component - visual representation of a pedal board
 */
import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Pedal } from './Pedal';
import { Plus, X, GripVertical } from 'lucide-react';
export const PedalBoard = ({ board, onAddPedal, className }) => {
    const [pedals, setPedals] = useState(board.getPedals());
    const [draggedIndex, setDraggedIndex] = useState(null);
    React.useEffect(() => {
        const updatePedals = () => {
            setPedals(board.getPedals());
        };
        // Listen for board changes
        board.on('pedalAdded', updatePedals);
        board.on('pedalRemoved', updatePedals);
        board.on('pedalsReordered', updatePedals);
        return () => {
            board.off('pedalAdded', updatePedals);
            board.off('pedalRemoved', updatePedals);
            board.off('pedalsReordered', updatePedals);
        };
    }, [board]);
    const handleRemovePedal = useCallback((index) => {
        board.removePedalAt(index);
        setPedals(board.getPedals());
    }, [board]);
    const handleDragStart = useCallback((index) => {
        setDraggedIndex(index);
    }, []);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);
    const handleDrop = useCallback((e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            board.movePedal(draggedIndex, dropIndex);
            setPedals(board.getPedals());
        }
        setDraggedIndex(null);
    }, [draggedIndex, board]);
    return (_jsxs("div", { className: clsx('min-h-[400px] p-8 rounded-xl', 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900', 'border-4 border-gray-700 shadow-2xl', className), children: [_jsx("div", { className: "text-center mb-6", children: _jsx("h2", { className: "text-2xl font-bold text-white uppercase tracking-widest", children: "Pedalboard" }) }), _jsx("div", { className: "flex flex-wrap gap-6 justify-center items-center min-h-[300px]", children: pedals.length === 0 ? (_jsxs("div", { className: "text-gray-500 text-center", children: [_jsx("p", { className: "mb-4", children: "No pedals on the board" }), onAddPedal && (_jsxs("button", { onClick: onAddPedal, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto", children: [_jsx(Plus, { size: 20 }), "Add Pedal"] }))] })) : (_jsxs(_Fragment, { children: [pedals.map((pedal, index) => (_jsxs("div", { className: "relative group", draggable: true, onDragStart: () => handleDragStart(index), onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, index), children: [_jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move", children: _jsx(GripVertical, { className: "text-gray-400", size: 20 }) }), _jsx("button", { onClick: () => handleRemovePedal(index), className: "absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 flex items-center justify-center", children: _jsx(X, { size: 14 }) }), _jsx(Pedal, { pedal: pedal, className: clsx('transition-all duration-200', draggedIndex === index && 'opacity-50', 'hover:transform hover:scale-105') }), index < pedals.length - 1 && (_jsx("div", { className: "absolute top-1/2 -right-3 w-6 h-1 bg-gray-600 z-0" }))] }, `${pedal.name}-${index}`))), onAddPedal && (_jsxs("button", { onClick: onAddPedal, className: "w-32 h-48 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-gray-200", children: [_jsx(Plus, { size: 32 }), _jsx("span", { className: "mt-2", children: "Add Pedal" })] }))] })) }), _jsxs("div", { className: "flex justify-between mt-8 px-8", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600" }), _jsx("span", { className: "text-gray-400 text-sm uppercase", children: "Input" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-gray-400 text-sm uppercase", children: "Output" }), _jsx("div", { className: "w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600" })] })] })] }));
};
