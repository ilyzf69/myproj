"use client"
// MusicPlayerContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

// Définir le type pour les informations de la musique
type Music = {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoId: string;
};

// Définir le type pour le contexte
type MusicPlayerContextType = {
  currentTrack: Music | null;
  isPlaying: boolean;
  setCurrentTrack: (music: Music | null) => void;
  togglePlayPause: () => void;
};

// Créer le contexte avec un objet vide respectant le type MusicPlayerContextType
export const MusicPlayerContext = createContext<MusicPlayerContextType>({} as MusicPlayerContextType);

// Créer un provider pour le contexte
type MusicPlayerProviderProps = {
  children: ReactNode;
};

export const MusicPlayerProvider = ({ children }: MusicPlayerProviderProps) => {
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, setCurrentTrack, togglePlayPause }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

// Créer un hook personnalisé pour utiliser le contexte de musique
export const useMusicPlayer = () => useContext(MusicPlayerContext);