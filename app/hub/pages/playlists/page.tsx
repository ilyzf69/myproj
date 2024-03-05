"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import axios from 'axios';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon, PlayIcon } from '@heroicons/react/solid';
import { db } from '../../../firebaseConfig';
import { collection, doc, setDoc } from "firebase/firestore";

type Music = {
  id: string;
  title: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  emotion: Emotion;
};

type Emotion = '❤️' | '😀' | '😢' | '⚡';

type Playlist = {
  id: string;
  name: string;
  musics: Music[];
};

const emotions = [
  { icon: HeartIcon, name: 'Amour', query: 'love' },
  { icon: EmojiHappyIcon, name: 'Joyeux', query: 'happy' },
  { icon: EmojiSadIcon, name: 'Triste', query: 'sad' },
  { icon: LightningBoltIcon, name: 'Énergique', query: '⚡' },
];

const MoodsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [musics, setMusics] = useState<Music[]>([]);
  const [favorites, setFavorites] = useState<Music[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');

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
    const emotionQuery = emotions.find(e => e.name === emotion)?.query || '';
    if (emotionQuery) {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 5,
          q: emotionQuery,
          type: 'playlist',
          key: 'AIzaSyCw3tcO0cLDtoM-PeixLqQX2NQ5HTiIqyw',
        },
      });

      const fetchedTracks: Music[] = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        isFavorite: favorites.some(f => f.id === item.id.videoId),
        emotion: selectedEmotion, // Assign emotion to each track
      }));

      setMusics(fetchedTracks);
    }
  };

  const toggleFavorite = (music: Music) => {
    const updatedFavorites = music.isFavorite ? favorites.filter(f => f.id !== music.id) : [...favorites, music];
    setMusics(musics.map(m => (m.id === music.id ? { ...m, isFavorite: !m.isFavorite } : m)));
    setFavorites(updatedFavorites);
  };

  const handleAddPlaylist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPlaylistRef = doc(collection(db, 'playlists'));
    const newPlaylist: Playlist = {
      id: newPlaylistRef.id,
      name: newPlaylistName,
      musics: musics.filter(music => music.isFavorite),
    };
  
    await setDoc(newPlaylistRef, newPlaylist);
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
  };

  const handleEmotionSelection = (emotion: Emotion) => {
    setSelectedEmotion(selectedEmotion === emotion ? null : emotion);
  };

  return (
    <div className="flex flex-col h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center p-10">
        <h1 className="text-4xl font-bold text-green-500 mb-5">Découvrir</h1>
        <p className="text-xl mb-10">Explorez de nouveaux contenus et tendances.</p>
        <div className="grid grid-cols-2 gap-5">
          {emotions.map(({ icon: Icon, name, query }) => (
            <button
              key={name}
              onClick={() =>  setSelectedEmotion(name as Emotion)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center ${
                selectedEmotion === query ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              } transition duration-300 ease-in-out`}
            >
              <Icon className="w-10 h-10 mb-2" />
              {name}
            </button>
          ))}
        </div>
        <div className="track-list mt-8 overflow-auto max-h-96">
          {musics.map(music => (
            <div key={music.id} className="track-item mb-4">
              <HeartIcon
                className={`ml-2 h-6 w-6 cursor-pointer ${music.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => toggleFavorite(music)}
              />
              <img src={music.thumbnailUrl} alt={music.title} className="inline-block mr-2" style={{ width: '100px', height: 'auto' }} />
              <span>{music.title}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddPlaylist} className="flex flex-col items-center mt-5">
          <input
            type="text"
            placeholder="Nom de la playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded-md"
          />
          <button 
            type="submit" 
            className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Créer Playlist
          </button>
        </form>
        <div className="playlist-list mt-8 overflow-auto max-h-96">
          {playlists.map(playlist => (
            <div key={playlist.id} className="playlist-item mb-4">
              <h2 className="text-lg font-semibold">{playlist.name}</h2>
              {playlist.musics.map(music => (
                <div key={music.id} className="track-item">
                  <img src={music.thumbnailUrl} alt={music.title} className="inline-block mr-2" style={{ width: '100px', height: 'auto' }} />
                  <span>{music.title}</span>
                </div>
              ))}
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
