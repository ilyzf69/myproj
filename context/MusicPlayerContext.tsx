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
};

export const MusicPlayerContext = createContext<MusicPlayerContextType>({
  currentTrack: null,
  setCurrentTrack: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
});

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <MusicPlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
