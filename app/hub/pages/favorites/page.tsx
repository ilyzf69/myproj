"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { HeartIcon } from '@heroicons/react/solid';

type Music = {
  id: string;
  title: string;
  thumbnailUrl: string;
  emotion: string;
  isFavorite?: boolean;
};

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Music[]>([]);

  useEffect(() => {
    // Initialiser les favoris à partir de localStorage seulement côté client
    if (typeof window !== "undefined") {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(storedFavorites);
    }
  }, []);

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(music => music.id !== id);
    setFavorites(updatedFavorites);
    if (typeof window !== "undefined") {
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const getEmoji = (emotion: string) => {
    switch (emotion) {
      case '❤️': return '❤️';
      case '😀': return '😀';
      case '😢': return '😢';
      case '⚡': return '⚡';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Favoris</h1>
          <p className="mt-2 text-lg">Retrouvez vos contenus favoris.</p>
          <div>
            {favorites.map((music) => (
              <div key={music.id} className="flex items-center mt-2">
                <span>{getEmoji(music.emotion)}</span>
                <a href={`https://www.youtube.com/watch?v=${music.id}`} target="_blank" rel="noopener noreferrer">
                  {music.title}
                </a>
                <img src={music.thumbnailUrl} alt={music.title} />
                <HeartIcon 
                  className="ml-2 h-6 w-6 text-red-500 cursor-pointer" 
                  onClick={() => removeFavorite(music.id)} 
                />
              </div>
            ))}
          </div>
        </div>
        <Link href="/hub">
          <p className="mt-10 p-4 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out flex items-center justify-center">
            Retour au Hub
          </p>
        </Link>
      </div>
      <ChatPopup/>
    </div>
  );
};

export default FavoritesPage;
