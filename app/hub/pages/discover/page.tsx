"use client"
// use client
import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import axios from 'axios';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { MusicPlayerContext } from '../../../../context/MusicPlayerContext'; // Importez ou créez ce contexte

type Music = {
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
};

type Emotion = '❤️' | '😀' | '😢' | '⚡';

const emotions = [
  { icon: EmojiHappyIcon, name: 'Amour', query: 'love songs' },
  { icon: EmojiSadIcon, name: 'Joyeux', query: 'happy songs' },
  { icon: LightningBoltIcon, name: 'Triste', query: 'sad songs' },
  { icon: HeartIcon, name: 'Énergique', query: 'energetic songs' },
];

const MoodsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [musics, setMusics] = useState<Music[]>([]);
  const [favorites, setFavorites] = useState<Music[]>([]);
  const { setCurrentTrack } = useContext(MusicPlayerContext);

  useEffect(() => {
    const savedFavorites = JSON.parse(window.localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (selectedEmotion) {
      fetchTracks(selectedEmotion);
    }
  }, [selectedEmotion]);

  useEffect(() => {
    window.localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchTracks = async (emotion: Emotion) => {
    const query = emotions.find(e => e.name === emotion)?.query || '';
    if (query) {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 4,
          q: query,
          type: 'video',
          key: 'AIzaSyBu2Nefj0UMltKDqNWBT5uwcJwv9nnAZqo',
        },
      });

      const fetchedTracks: Music[] = response.data.items.map((item: any) => ({
        videoId: item.id.videoId,
        id: item.id.videoId,
        title: item.snippet.title,
        artist: 'Unknown Artist', // Ajoutez un champ artiste si nécessaire
        thumbnailUrl: item.snippet.thumbnails.default.url,
        isFavorite: favorites.some(f => f.id === item.id.videoId),
      }));

      setMusics(fetchedTracks);
    }
  };

  const toggleFavorite = (music: Music) => {
    const updatedFavorites = music.isFavorite ? favorites.filter(f => f.id !== music.id) : [...favorites, music];
    setMusics(musics.map(m => m.id === music.id ? { ...m, isFavorite: !m.isFavorite } : m));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center p-10">
        <h1 className="text-4xl font-bold text-green-500 mb-5">Découvrir</h1>
        <p className="text-xl mb-10">Explorez de nouveaux contenus et tendances.</p>
        <div className="grid grid-cols-2 gap-5">
          {emotions.map(({ icon: Icon, name }) => (
            <button
              key={name}
              onClick={() => setSelectedEmotion(name as Emotion)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center ${
                selectedEmotion === name ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              } transition duration-300 ease-in-out`}
            >
              <Icon className="w-10 h-10 mb-2" />
              {name}
            </button>
          ))}
        </div>
        <div className="track-list mt-8">
          {musics.map(music => (
            <div key={music.id} className="track-item mb-4 flex items-center">
              <HeartIcon
                className={`ml-2 h-6 w-6 cursor-pointer ${music.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => toggleFavorite(music)}
              />
              <img src={music.thumbnailUrl} alt={music.title} className="inline-block mr-2" style={{ width: '100px', height: 'auto' }} />
              <span className="mr-2">{music.title}</span>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => setCurrentTrack(music)}
              >
                Play
              </button>
            </div>
          ))}
        </div>
        <Link href="/hub">
          <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center">
            Retour au Hub
          </p>
        </Link>
      </div>
      <ChatPopup />
    </div>
  );
};

export default MoodsPage;
