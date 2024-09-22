"use client";
import React, { useState, useEffect } from "react";
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid";
import YouTube from "react-youtube";

const MusicBar: React.FC = () => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [titleMusic, setTitleMusic] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Charger les informations de la musique et la position depuis le localStorage
  useEffect(() => {
    const savedTrack = localStorage.getItem("currentTrack");
    const savedTime = localStorage.getItem("currentTime");
    
    if (savedTrack) {
      const track = JSON.parse(savedTrack);
      if (track) {
        setCurrentTrack(track);
        setTitleMusic(track.title || "Inconnue");
        setThumbnailUrl(track.thumbnailUrl || "");
        
        // Charger le temps actuel à partir du localStorage
        if (savedTime) {
          setCurrentTime(parseFloat(savedTime));
        }
      }
    }
  }, []);

  // Utiliser un intervalle pour vérifier les changements dans le localStorage
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTrack = localStorage.getItem("currentTrack");
      if (updatedTrack) {
        const track = JSON.parse(updatedTrack);
        if (track && track.id !== currentTrack?.id) {
          setCurrentTrack(track);
          setTitleMusic(track.title || "Inconnue");
          setThumbnailUrl(track.thumbnailUrl || "");

          // Lecture de la musique en fonction de la source
          if (player && track.source === "youtube") {
            player.loadVideoById(track.videoId);
            player.seekTo(0); // Revenir à 0 seconde
            player.playVideo();
            setIsPlaying(true);
            setCurrentTime(0); // Réinitialiser le temps actuel à 0
            setProgress(0); // Réinitialiser la progression à 0
          } else if (track.source === "spotify") {
            document.getElementById("spotify-player")?.setAttribute("src", `https://open.spotify.com/embed/track/${track.id}`);
            setIsPlaying(true);
            setCurrentTime(0); // Réinitialiser le temps actuel à 0
            setProgress(0); // Réinitialiser la progression à 0
          }
        }
      }
    }, 1000); // Vérifie toutes les secondes

    return () => clearInterval(intervalId);
  }, [currentTrack, player]);

  // Options de configuration de YouTube
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
    },
  };

  // Fonction appelée lorsque le lecteur YouTube est prêt
  const onPlayerReady = (event: any) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration() || 0);

    // Restaurer le temps de la vidéo
    if (currentTime > 0) {
      event.target.seekTo(currentTime);
    }

    if (isPlaying) {
      event.target.playVideo();
    }
  };

  // Gérer la lecture/pause
  const handlePlayPause = () => {
    if (currentTrack?.source === "youtube" && player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    } else if (currentTrack?.source === "spotify") {
      const spotifyIframe = document.getElementById("spotify-player") as HTMLIFrameElement;
      if (spotifyIframe) {
        const spotifyWindow = spotifyIframe.contentWindow;
        if (spotifyWindow) {
          spotifyWindow.postMessage({ command: isPlaying ? "pause" : "play" }, "*");
          setIsPlaying(!isPlaying);
        }
      }
    }
  };

  // Gérer le changement de volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (player && currentTrack?.source === "youtube") {
      player.setVolume(newVolume);
    }
  };

  // Gérer la recherche dans la vidéo
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (player && currentTrack?.source === "youtube") {
      const seekTime = (player.getDuration() / 100) * parseFloat(e.target.value);
      player.seekTo(seekTime);
      setProgress(parseFloat(e.target.value));
      localStorage.setItem("currentTime", seekTime.toString());
    }
  };

  // Gérer le mute/démute
  const handleMute = () => {
    if (player && currentTrack?.source === "youtube") {
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
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Mettre à jour le temps de la vidéo et la progression
  useEffect(() => {
    if (player && currentTrack?.source === "youtube") {
      const interval = setInterval(() => {
        if (player.getCurrentTime && player.getDuration) {
          const current = player.getCurrentTime();
          const videoDuration = player.getDuration();

          if (current !== undefined && videoDuration !== undefined) {
            setCurrentTime(current);
            setProgress((current / videoDuration) * 100);
            localStorage.setItem("currentTime", current.toString());
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [player, currentTrack]);

  return (
    <div className="bg-gray-800 text-white p-4 w-full max-w-3xl mx-auto rounded-lg flex flex-col items-center justify-between">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" className="h-12 w-12 mr-4" />}
          <div>
            <p className="text-lg font-bold">{titleMusic || "Aucune musique en cours"}</p>
            <p className="text-sm text-gray-400">{currentTrack?.artist || ""}</p>
          </div>
        </div>
        {currentTrack?.source === "youtube" && (
          <YouTube videoId={currentTrack?.videoId} opts={opts} onReady={onPlayerReady} />
        )}
        {currentTrack?.source === "spotify" && (
          <iframe
            id="spotify-player"
            src={`https://open.spotify.com/embed/track/${currentTrack.id}`}
            width="300"
            height="80"
            allow="encrypted-media"
            className="rounded-md"
          />
        )}
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-white" />
            ) : (
              <PlayIcon className="w-6 h-6 text-white" />
            )}
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
