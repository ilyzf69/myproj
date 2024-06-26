"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import { db, auth } from '../../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useMusicPlayer } from '../../../../context/MusicPlayerContext';
import { HeartIcon } from '@heroicons/react/solid';
import logoYT from '../../../../image/youtube.png';
import logoSP from '../../../../image/spotify.png';
import { onAuthStateChanged } from "firebase/auth";
import MusicPlayerBar from '../../../../components/MusicPlayerBar';

type Music = {
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  source: string;
};

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Music[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Music[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { setCurrentTrack, setIsPlaying } = useMusicPlayer();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchFavorites(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [favorites, filter]);

  const fetchFavorites = async (userId: string) => {
    const favoritesCollection = collection(db, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesCollection);
    const fetchedFavorites = favoritesSnapshot.docs.map(doc => doc.data() as Music);
    setFavorites(fetchedFavorites);
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredFavorites(favorites);
    } else {
      setFilteredFavorites(favorites.filter(music => music.source === filter));
    }
  };

  const removeFavorite = async (id: string) => {
    if (!userId) return;

    const musicRef = doc(db, `users/${userId}/favorites`, id);
    await deleteDoc(musicRef);
    setFavorites(favorites.filter(favorite => favorite.id !== id));
  };

  const handlePlay = (music: Music) => {
    setCurrentTrack(music);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-screen flex-col">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-green-500 mb-5">Mes Favoris</h1>
        <div className="mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`mr-2 p-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('youtube')}
            className={`mr-2 p-2 rounded ${filter === 'youtube' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            YouTube
          </button>
          <button
            onClick={() => setFilter('spotify')}
            className={`p-2 rounded ${filter === 'spotify' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Spotify
          </button>
        </div>
        <div className="track-list mt-8 w-full flex-1 flex flex-col items-center p-10">
          {filteredFavorites.map(music => (
            <div key={music.id} className="track-item mb-4 flex items-center bg-white shadow-md p-4 rounded-lg">
              <HeartIcon
                className="ml-2 h-6 w-6 cursor-pointer text-red-500"
                onClick={() => removeFavorite(music.id)}
              />
              <img src={music.thumbnailUrl} alt={music.title} className="inline-block mr-2 rounded" style={{ width: '100px', height: 'auto' }} />
              <p className="mr-2 flex-1">{music.title}</p>
              {music.source === 'youtube' && <img src={logoYT.src} alt="YouTube" className="h-6 w-6 mr-2" />}
              {music.source === 'spotify' && <img src={logoSP.src} alt="Spotify" className="h-6 w-6 mr-2" />}
              <button
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => handlePlay(music)}
              >
                Écouter
              </button>
            </div>
          ))}
        </div>
      </div>
      <MusicPlayerBar /> {/* Ajouter le composant MusicPlayerBar en bas */}
    </div>
  );
};

export default FavoritesPage;
