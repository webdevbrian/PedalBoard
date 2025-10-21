/**
 * Example React application demonstrating Pedalboard.js
 */

import { useState, useEffect, useRef } from 'react';
import { Stage, Board, Overdrive, Delay, Reverb, Volume, Cabinet } from '../src';
import { PedalBoard } from '../src/components/PedalBoard';
import { AudioControls } from '../src/components/AudioControls';
import { Box } from '../src/pedals/Box';
import { Save, FolderOpen } from 'lucide-react';

function App() {
  const initRef = useRef(false);
  const stageRef = useRef<Stage | null>(null);
  const boardRef = useRef<Board | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [showPedalMenu, setShowPedalMenu] = useState(false);

  useEffect(() => {
    // Only initialize once
    if (initRef.current) return;
    initRef.current = true;
    
    // Initialize audio context and stage
    const newStage = new Stage();
    const newBoard = new Board(newStage.getContext());
    
    // Store in refs immediately
    stageRef.current = newStage;
    boardRef.current = newBoard;
    
    // Add some default pedals
    const overdrive = new Overdrive(newStage.getContext());
    const delay = new Delay(newStage.getContext());
    const reverb = new Reverb(newStage.getContext());
    const volume = new Volume(newStage.getContext());
    
    // Add pedals to board
    newBoard.addPedals([overdrive, delay, reverb, volume]);
    
    // Configure default settings
    overdrive.setDrive(2);
    overdrive.setTone(5);
    overdrive.setLevel(6);
    
    delay.setDelayTimer(3);
    delay.setFeedbackGain(4);
    delay.setLevel(7);
    
    reverb.setLevel(3);
    volume.setLevel(10);
    
    // Set board on stage
    newStage.setBoard(newBoard);
    
    setStage(newStage);
    setBoard(newBoard);
    
    // Resume audio context on user interaction
    const handleUserInteraction = async () => {
      await newStage.resume();
      document.removeEventListener('click', handleUserInteraction);
    };
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      console.log('Cleanup called');
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const addPedal = (type: string) => {
    if (!stage || !board) return;
    
    const context = stage.getContext();
    let pedal: Box | null = null;
    
    switch (type) {
      case 'overdrive':
        pedal = new Overdrive(context);
        break;
      case 'delay':
        pedal = new Delay(context);
        break;
      case 'reverb':
        pedal = new Reverb(context);
        break;
      case 'volume':
        pedal = new Volume(context);
        break;
      case 'cabinet':
        pedal = new Cabinet(context);
        break;
    }
    
    if (pedal) {
      board.addPedal(pedal);
      setShowPedalMenu(false);
    }
  };

  const savePreset = () => {
    if (!board) return;
    
    const preset = board.toJSON();
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedalboard-preset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stage || !board) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Pedalboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Pedalboard.js
            <span className="text-sm text-gray-400 ml-2">v2.0</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={savePreset}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Preset
            </button>
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <FolderOpen size={18} />
              Load Preset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4">
          <div className="w-80 space-y-4">
            <AudioControls stage={stage} />
            
          </div>
          
          <PedalBoard 
            board={board} 
            onAddPedal={() => setShowPedalMenu(true)}
            className="flex-1" 
          />
        </div>
      </div>

      {/* Pedal Selection Menu */}
      {showPedalMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4">Add Pedal</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'overdrive', name: 'Overdrive', color: 'bg-yellow-600' },
                { type: 'delay', name: 'Delay', color: 'bg-blue-600' },
                { type: 'reverb', name: 'Reverb', color: 'bg-purple-600' },
                { type: 'volume', name: 'Volume', color: 'bg-gray-600' },
                { type: 'cabinet', name: 'Cabinet', color: 'bg-green-600' },
              ].map(pedal => (
                <button
                  key={pedal.type}
                  onClick={() => addPedal(pedal.type)}
                  className={`${pedal.color} text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  {pedal.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPedalMenu(false)}
              className="mt-4 w-full py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
