"use client";

import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/solid';
import YouTube from 'react-youtube';

const MusicBar: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying, titleMusic, thumbnailUrl, progress, setProgress } = useMusicPlayer();
  const [player, setPlayer] = useState<any>(null);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Configuration de YouTube
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady = (event: any) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
    setIsPlaying(true);  // Autoplay dès que la musique est prête
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (player) {
      const seekTime = (player.getDuration() / 100) * parseFloat(e.target.value);
      player.seekTo(seekTime);
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Gérer le temps de la vidéo et mettre à jour la barre de progression
  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        if (player.getCurrentTime && player.getDuration) {
          const current = player.getCurrentTime();
          const duration = player.getDuration();
          setCurrentTime(current);
          setProgress((current / duration) * 100);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [player]);

  return (
    <div className="bg-gray-800 text-white p-4 w-full flex flex-col items-center justify-between">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" className="h-12 w-12 mr-4" />}
          <div>
            <p className="text-lg font-bold">{titleMusic || 'Aucune musique en cours'}</p>
            <p className="text-sm text-gray-400">{currentTrack?.artist || ''}</p>
          </div>
        </div>
        <YouTube videoId={currentTrack?.videoId} opts={opts} onReady={onPlayerReady} />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white" />}
          </button>
        </div>
        <div className="flex-1 mx-4">
          <input type="range" value={progress} onChange={handleSeek} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration - currentTime)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={handleMute} className="mr-2">
            {isMuted ? <VolumeOffIcon className="w-6 h-6 text-white" /> : <VolumeUpIcon className="w-6 h-6 text-white" />}
          </button>
          <input type="range" value={volume} min="0" max="100" step="1" onChange={handleVolumeChange} className="ml-2 w-24" />
        </div>
      </div>
    </div>
  );
};

export default MusicBar;
