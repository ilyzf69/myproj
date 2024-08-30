"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { PlayIcon, PauseIcon, RewindIcon, FastForwardIcon, VolumeUpIcon, VolumeOffIcon, RefreshIcon } from '@heroicons/react/solid';
import YouTube from 'react-youtube';

const MusicBar: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useMusicPlayer();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [player, setPlayer] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<any>(null);

  const onPlayerReady = (event: any) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
        clearInterval(intervalId);
      } else {
        player.playVideo();
        const id = setInterval(() => {
          setCurrentTime(player.getCurrentTime());
          setProgress((player.getCurrentTime() / player.getDuration()) * 100);
        }, 1000);
        setIntervalId(id);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = () => {
    if (player) {
      const newTime = Math.max(0, player.getCurrentTime() - 10);
      player.seekTo(newTime);
      setCurrentTime(newTime);
      setProgress((newTime / player.getDuration()) * 100);
    }
  };

  const handleFastForward = () => {
    if (player) {
      const newTime = Math.min(player.getDuration(), player.getCurrentTime() + 10);
      player.seekTo(newTime);
      setCurrentTime(newTime);
      setProgress((newTime / player.getDuration()) * 100);
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
      setCurrentTime(seekTime);
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleRestart = () => {
    if (player) {
      player.seekTo(0);
      setCurrentTime(0);
      setProgress(0);
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

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [intervalId]);

  return (
    <div className="bg-[#04060a] text-white p-4 w-full flex flex-col items-center justify-between">
      <audio onEnded={() => setIsPlaying(false)} />
      <div className="flex items-center justify-center mb-2">
        <p className="text-sm font-semibold">
          {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : ' - '}
        </p>
      </div>
      <YouTube videoId="7UgWT_H4Kp8" opts={opts} onReady={onPlayerReady} />
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button onClick={handleRewind}>
            <RewindIcon className="w-6 h-6 text-white" />
          </button>
          <button onClick={handlePlayPause} className="mx-2">
            {isPlaying ? <PauseIcon className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white" />}
          </button>
          <button onClick={handleFastForward}>
            <FastForwardIcon className="w-6 h-6 text-white" />
          </button>
          <button onClick={handleRestart} className="ml-2">
            <RefreshIcon className="w-6 h-6 text-white" />
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
