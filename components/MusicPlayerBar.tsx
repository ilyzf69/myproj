import React, { useContext, useRef, useEffect, useState } from 'react';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import { PauseIcon, PlayIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/solid';

const MusicPlayerBar: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useContext(MusicPlayerContext);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const iframe = audioRef.current;
      const player = iframe.contentWindow;

      if (isPlaying) {
        player?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        player?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        // Mettez à jour la progression
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Changer le volume
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Changer la progression
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white text-black p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center">
        <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} className="w-16 h-16 mr-4 rounded" />
        <div>
          <h3 className="text-lg">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button onClick={togglePlayPause} className="p-2">
          {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-64 mt-2"
        />
      </div>
      <div className="flex items-center">
        <VolumeOffIcon className="h-6 w-6 mr-2" />
        <input
          type="range"
          min="0"
          max="100"
          onChange={handleVolumeChange}
          className="w-24"
        />
        <VolumeUpIcon className="h-6 w-6 ml-2" />
      </div>
      {currentTrack.source === 'youtube' && (
        <iframe
          ref={audioRef}
          src={`https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&version=3&autoplay=1`}
          style={{ display: 'none' }}
        />
      )}
      {currentTrack.source === 'spotify' && (
        <iframe
          ref={audioRef}
          src={`https://open.spotify.com/embed/track/${currentTrack.videoId}`}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default MusicPlayerBar;
