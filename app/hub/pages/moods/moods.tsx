"use client"
import React, { useState, useEffect } from 'react';
import { musicData } from './musicData'; // Assurez-vous que le chemin d'importation est correct

// Définition des types pour les émotions et les données musicales
export type Emotion = '❤️' | '😀' | '😢' | '⚡'; // Ajoutez d'autres emojis ici si nécessaire
type Music = {
  id: string;
  title: string;
  url: string;
  views: number;
  language: string;
};

interface MoodsProps {
  emotion: Emotion;
}

const Moods: React.FC<MoodsProps> = ({ emotion }) => {
  // Utilisez une assertion de type pour accéder à musicData
  const [musics, setMusics] = useState<Music[]>(musicData[emotion as keyof typeof musicData] || []);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Cette fonction est appelée chaque fois que `emotion` change.
    setMusics(musicData[emotion as keyof typeof musicData] || []);
  }, [emotion]);

  const sortMusics = (type: string) => {
    let sortedMusics = [...musics];
    if (type === 'views') {
      sortedMusics.sort((a, b) => b.views - a.views);
    }
    // Implémentez d'autres logiques de tri en fonction du type si nécessaire
    setMusics(sortedMusics);
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-semibold">Musiques pour {emotion}</h2>
      <div>
        <select onChange={(e) => sortMusics(e.target.value)} className="mb-4">
          <option value="">Filtrer par</option>
          <option value="views">Vues</option>
          <option value="tendance">Tendances</option>
          {/* Ajoutez d'autres options de filtrage ici */}
        </select>
        {musics.map((music) => (
          <div key={music.id} className="flex items-center mt-2">
            <span className="text-2xl mr-2">{emotion}</span>
            <a href={music.url} target="_blank" rel="noopener noreferrer">
              {music.title} - {music.views} vues
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moods;
