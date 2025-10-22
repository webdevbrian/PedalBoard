/**
 * Example React application demonstrating Pedalboard.js
 */

import { useState, useEffect, useRef } from 'react';
import { Stage, Board, Overdrive, Delay, Reverb, Volume, Cabinet } from '../src';
import { PedalBoard } from '../src/components/PedalBoard';
import { AudioControls } from '../src/components/AudioControls';
import { Box } from '../src/pedals/Box';
import { Save, FolderOpen, Github, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const initRef = useRef(false);
  const stageRef = useRef<Stage | null>(null);
  const boardRef = useRef<Board | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [showPedalMenu, setShowPedalMenu] = useState(false);
  const [inputType, setInputType] = useState<'file' | 'live'>('file');
  const [audioControlsCollapsed, setAudioControlsCollapsed] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);

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
    
    // Start with empty pedalboard - users can add pedals as needed
    
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
      // Clear preset name when board is modified
      setCurrentPreset(null);
    }
  };

  const savePreset = () => {
    if (!board) return;
    
    try {
      const preset = board.toJSON();
      const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pedalboard-preset-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('Preset saved successfully');
    } catch (error) {
      console.error('Failed to save preset:', error);
      alert('Failed to save preset. Please try again.');
    }
  };

  // Pedal factory function
  const createPedal = (type: string) => {
    if (!stage) return null;
    
    const context = stage.getContext();
    
    switch (type) {
      case 'overdrive':
        return new Overdrive(context);
      case 'delay':
        return new Delay(context);
      case 'reverb':
        return new Reverb(context);
      case 'volume':
        return new Volume(context);
      case 'cabinet':
        return new Cabinet(context);
      default:
        console.warn(`Unknown pedal type: ${type}`);
        return null;
    }
  };

  const loadPreset = () => {
    if (!board || !stage) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const preset = JSON.parse(text);
        
        // Stop current audio
        stage.stop();
        
        // Load the preset into the board with pedal factory
        board.fromJSON(preset, createPedal);
        
        // Set the current preset name (remove .json extension)
        const presetName = file.name.replace(/\.json$/i, '');
        setCurrentPreset(presetName);
        
        console.log('Preset loaded successfully:', presetName);
        // The board will emit events that trigger UI updates automatically
      } catch (error) {
        console.error('Failed to load preset:', error);
        alert('Failed to load preset. Please check the file format.');
      }
    };
    input.click();
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
          <div>
            <h1 className="text-2xl font-bold text-white">
              Pedalboard.js
              <span className="text-sm text-gray-400 ml-2">v2.0</span>
            </h1>
            <a 
              href="https://github.com/webdevbrian/PedalBoard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mt-1"
            >
              <Github size={14} />
              View on GitHub
            </a>
          </div>
          <div className="flex gap-2">
            <button
              onClick={savePreset}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Preset
            </button>
            <button
              onClick={loadPreset}
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
          {/* Collapsible Audio Controls */}
          <div className={`transition-all duration-300 ${audioControlsCollapsed ? 'w-12' : 'w-80'}`}>
            {audioControlsCollapsed ? (
              /* Collapsed state - just toggle button */
              <button
                onClick={() => setAudioControlsCollapsed(false)}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title="Expand Audio Controls"
              >
                <ChevronRight size={20} />
              </button>
            ) : (
              /* Expanded state - full controls */
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg">Audio Controls</h3>
                  <button
                    onClick={() => setAudioControlsCollapsed(true)}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                    title="Collapse Audio Controls"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
                <AudioControls 
                  stage={stage} 
                  inputType={inputType}
                  onInputTypeChange={setInputType}
                  hideTitle={true}
                />
              </div>
            )}
          </div>
          
          <PedalBoard 
            board={board} 
            onAddPedal={() => setShowPedalMenu(true)}
            onBoardModified={() => setCurrentPreset(null)}
            inputType={inputType}
            currentPreset={currentPreset}
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
