import React, { createContext, useState, useContext, ReactNode } from 'react';

type Music = {
  url: string | undefined;
  source: string;
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
};

type MusicPlayerContextType = {
  currentTrack: Music | null;
  setCurrentTrack: (track: Music) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  titleMusic: string; 
  setTitleMusic: (title: string) => void;  
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void; 
  progress: number;
  setProgress: (progress: number) => void;
};

export const MusicPlayerContext = createContext<MusicPlayerContextType>({
  currentTrack: null,
  setCurrentTrack: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  titleMusic: '', 
  setTitleMusic: () => {}, 
  thumbnailUrl: '',
  setThumbnailUrl: () => {},
  progress: 0,
  setProgress: () => {},
});

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [titleMusic, setTitleMusic] = useState<string>(''); 
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(''); 
  const [progress, setProgress] = useState<number>(0);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        titleMusic,
        setTitleMusic,
        thumbnailUrl,
        setThumbnailUrl,
        progress,
        setProgress,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
