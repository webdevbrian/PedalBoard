/**
 * Audio controls component for input/output management
 */

import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { Play, Pause, Mic, Upload, Volume2, VolumeX } from 'lucide-react';
import { Stage } from '../core/Stage';

interface AudioControlsProps {
  stage: Stage;
  className?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  stage,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputType, setInputType] = useState<'file' | 'live'>('file');
  const [volume, setVolume] = useState(stage.getVolume());
  const [isMuted, setIsMuted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlayPause = async () => {
    if (isPlaying) {
      stage.stop();
      setIsPlaying(false);
    } else {
      if (inputType === 'live') {
        try {
          await stage.startLiveInput();
          setIsPlaying(true);
        } catch (error) {
          console.error('Failed to start live input:', error);
          alert('Failed to access microphone. Please check permissions.');
        }
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await stage.playFile(file);
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        alert('Failed to load audio file. Please try another file.');
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    stage.setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      stage.setVolume(volume);
      setIsMuted(false);
    } else {
      stage.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleInputTypeChange = (type: 'file' | 'live') => {
    if (isPlaying) {
      stage.stop();
      setIsPlaying(false);
    }
    setInputType(type);
  };

  return (
    <div className={clsx(
      'bg-gray-800 rounded-lg p-6 shadow-xl',
      className
    )}>
      <h3 className="text-white font-bold text-lg mb-4">Audio Controls</h3>
      
      {/* Input Type Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleInputTypeChange('file')}
          className={clsx(
            'flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2',
            inputType === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          )}
        >
          <Upload size={18} />
          File
        </button>
        <button
          onClick={() => handleInputTypeChange('live')}
          className={clsx(
            'flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2',
            inputType === 'live'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          )}
        >
          <Mic size={18} />
          Live Input
        </button>
      </div>

      {/* File Upload */}
      {inputType === 'file' && (
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Choose Audio File
          </button>
        </div>
      )}

      {/* Play/Pause Button */}
      <div className="mb-4">
        <button
          onClick={handlePlayPause}
          disabled={inputType === 'file' && !isPlaying && !fileInputRef.current?.files?.length}
          className={clsx(
            'w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isPlaying
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          )}
        >
          {isPlaying ? (
            <>
              <Pause size={20} />
              Stop
            </>
          ) : (
            <>
              <Play size={20} />
              {inputType === 'live' ? 'Start Live Input' : 'Play'}
            </>
          )}
        </button>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Master Volume</span>
          <button
            onClick={handleMuteToggle}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full"
        />
        <div className="text-center text-gray-400 text-sm">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </div>
      </div>

      {/* Sample Audio Files */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-gray-300 text-sm mb-2">Sample Audio</h4>
        <div className="space-y-2">
          {['Sample 1', 'Sample 2', 'Sample 3'].map((sample, index) => (
            <button
              key={sample}
              onClick={async () => {
                try {
                  await stage.play(`/audio/sample${index + 1}.mp3`);
                  setIsPlaying(true);
                } catch (error) {
                  console.error('Failed to load sample:', error);
                }
              }}
              className="w-full py-1 px-3 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors text-sm"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
