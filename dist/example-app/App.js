import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Example React application demonstrating Pedalboard.js
 */
import { useState, useEffect } from 'react';
import { Stage, Board, Overdrive, Delay, Reverb, Volume, Cabinet } from '../src';
import { PedalBoard } from '../src/components/PedalBoard';
import { AudioControls } from '../src/components/AudioControls';
import { Save, FolderOpen } from 'lucide-react';
function App() {
    const [stage, setStage] = useState(null);
    const [board, setBoard] = useState(null);
    const [showPedalMenu, setShowPedalMenu] = useState(false);
    useEffect(() => {
        // Initialize audio context and stage
        const newStage = new Stage();
        const newBoard = new Board(newStage.getContext());
        // Add some default pedals
        const overdrive = new Overdrive(newStage.getContext());
        const delay = new Delay(newStage.getContext());
        const reverb = new Reverb(newStage.getContext());
        const volume = new Volume(newStage.getContext());
        // Configure default settings
        overdrive.setDrive(2);
        overdrive.setTone(5);
        overdrive.setLevel(6);
        delay.setDelayTimer(3);
        delay.setFeedbackGain(4);
        delay.setLevel(7);
        reverb.setLevel(3);
        volume.setLevel(10);
        // Add pedals to board
        newBoard.addPedals([overdrive, delay, reverb, volume]);
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
            newStage.dispose();
            document.removeEventListener('click', handleUserInteraction);
        };
    }, []);
    const addPedal = (type) => {
        if (!stage || !board)
            return;
        const context = stage.getContext();
        let pedal = null;
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
        if (!board)
            return;
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
        return (_jsx("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center", children: _jsx("div", { className: "text-white text-xl", children: "Loading Pedalboard..." }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black", children: [_jsx("header", { className: "bg-black/50 backdrop-blur-sm border-b border-gray-800", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex items-center justify-between", children: [_jsxs("h1", { className: "text-2xl font-bold text-white", children: ["Pedalboard.js", _jsx("span", { className: "text-sm text-gray-400 ml-2", children: "v2.0" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: savePreset, className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2", children: [_jsx(Save, { size: 18 }), "Save Preset"] }), _jsxs("button", { className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2", children: [_jsx(FolderOpen, { size: 18 }), "Load Preset"] })] })] }) }), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx(AudioControls, { stage: stage }) }), _jsx("div", { className: "lg:col-span-3", children: _jsx(PedalBoard, { board: board, onAddPedal: () => setShowPedalMenu(true) }) })] }) }), showPedalMenu && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4", children: [_jsx("h3", { className: "text-white text-xl font-bold mb-4", children: "Add Pedal" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                { type: 'overdrive', name: 'Overdrive', color: 'bg-yellow-600' },
                                { type: 'delay', name: 'Delay', color: 'bg-blue-600' },
                                { type: 'reverb', name: 'Reverb', color: 'bg-purple-600' },
                                { type: 'volume', name: 'Volume', color: 'bg-gray-600' },
                                { type: 'cabinet', name: 'Cabinet', color: 'bg-green-600' },
                            ].map(pedal => (_jsx("button", { onClick: () => addPedal(pedal.type), className: `${pedal.color} text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity`, children: pedal.name }, pedal.type))) }), _jsx("button", { onClick: () => setShowPedalMenu(false), className: "mt-4 w-full py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" })] }) }))] }));
}
export default App;
