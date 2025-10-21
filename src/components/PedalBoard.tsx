/**
 * PedalBoard component - visual representation of a pedal board
 */

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Pedal } from './Pedal';
import { Board } from '../core/Board';
import { Box } from '../pedals/Box';
import { Plus, X, GripVertical } from 'lucide-react';

interface PedalBoardProps {
  board: Board;
  onAddPedal?: () => void;
  className?: string;
}

export const PedalBoard: React.FC<PedalBoardProps> = ({
  board,
  onAddPedal,
  className
}) => {
  const [pedals, setPedals] = useState<Box[]>(board.getPedals());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleRemovePedal = useCallback((index: number) => {
    board.removePedalAt(index);
    setPedals(board.getPedals());
  }, [board]);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      board.movePedal(draggedIndex, dropIndex);
      setPedals(board.getPedals());
    }
    setDraggedIndex(null);
  }, [draggedIndex, board]);

  return (
    <div
      className={clsx(
        'min-h-[400px] p-8 rounded-xl',
        'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
        'border-4 border-gray-700 shadow-2xl',
        className
      )}
    >
      {/* Board title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
          Pedalboard
        </h2>
      </div>

      {/* Pedals container */}
      <div className="flex flex-wrap gap-6 justify-center items-center min-h-[300px]">
        {pedals.length === 0 ? (
          <div className="text-gray-500 text-center">
            <p className="mb-4">No pedals on the board</p>
            {onAddPedal && (
              <button
                onClick={onAddPedal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Add Pedal
              </button>
            )}
          </div>
        ) : (
          <>
            {pedals.map((pedal, index) => (
              <div
                key={`${pedal.name}-${index}`}
                className="relative group"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Drag handle */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                  <GripVertical className="text-gray-400" size={20} />
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemovePedal(index)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 flex items-center justify-center"
                >
                  <X size={14} />
                </button>

                {/* Pedal */}
                <Pedal
                  pedal={pedal}
                  className={clsx(
                    'transition-all duration-200',
                    draggedIndex === index && 'opacity-50',
                    'hover:transform hover:scale-105'
                  )}
                />

                {/* Cable visualization */}
                {index < pedals.length - 1 && (
                  <div className="absolute top-1/2 -right-3 w-6 h-1 bg-gray-600 z-0" />
                )}
              </div>
            ))}

            {/* Add pedal button at the end */}
            {onAddPedal && (
              <button
                onClick={onAddPedal}
                className="w-32 h-48 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-gray-200"
              >
                <Plus size={32} />
                <span className="mt-2">Add Pedal</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Input/Output jacks */}
      <div className="flex justify-between mt-8 px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600" />
          <span className="text-gray-400 text-sm uppercase">Input</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm uppercase">Output</span>
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600" />
        </div>
      </div>
    </div>
  );
};
