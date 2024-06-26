import React, { useContext, useState, useRef, useEffect } from 'react';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import YouTubePlayer from './YouTubePlayer';
import SpotifyPlayer from './SpotifyPlayer';
import { PauseIcon, PlayIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/solid';

const MusicPlayer: React.FC = () => {
  const { currentTrack, setCurrentTrack } = useContext(MusicPlayerContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center">
        <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-16 h-16 mr-4 rounded" />
        <div>
          <h3 className="text-lg">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={togglePlayPause} className="p-2">
          {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
        </button>
        <div className="flex items-center ml-4">
          <VolumeOffIcon className="h-6 w-6 mr-2" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24"
          />
          <VolumeUpIcon className="h-6 w-6 ml-2" />
        </div>
      </div>
      {currentTrack.source === 'youtube' && <YouTubePlayer videoId={currentTrack.videoId} />}
      {currentTrack.source === 'spotify' && <SpotifyPlayer trackId={currentTrack.videoId} />}
    </div>
  );
};

export default MusicPlayer;
