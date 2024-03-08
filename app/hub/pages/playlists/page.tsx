"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import axios from 'axios';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { db, auth } from '../../../firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, where, query } from "firebase/firestore";


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
  userId: string;
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(window.localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);

    const fetchPlaylists = async () => {
      const user = auth.currentUser;
      if (user) {
        const userPlaylistsQuery = query(collection(db, 'playlists'), where('userId', '==', user.uid));
        const playlistsSnapshot = await getDocs(userPlaylistsQuery);
        const fetchedPlaylists: Playlist[] = [];
        playlistsSnapshot.forEach((doc) => {
          fetchedPlaylists.push({ id: doc.id, ...doc.data() } as Playlist);
        });
        setPlaylists(fetchedPlaylists);
      }
    };
    fetchPlaylists();
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
          key: 'AIzaSyCKpHu0QPxCHrzPd_ByiFClj-akdqOtLTk',
        },
      });

      const fetchedTracks: Music[] = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        isFavorite: favorites.some(f => f.id === item.id.videoId),
        emotion: selectedEmotion,
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
    const user = auth.currentUser;
    if (user) {
      const newPlaylistRef = doc(collection(db, 'playlists'));
      const newPlaylist: Playlist = {
        id: newPlaylistRef.id,
        userId: user.uid,
        name: newPlaylistName,
        musics: musics.filter(music => music.isFavorite),
      };
    
      await setDoc(newPlaylistRef, newPlaylist);
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    await deleteDoc(doc(db, 'playlists', playlistId));
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistModal(true);
  };

  const handleClosePlaylistModal = () => {
    setSelectedPlaylist(null);
    setShowPlaylistModal(false);
  };

  const handleSearch = () => {
    const results = playlists.filter(playlist => playlist.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };

  return (
    <div className="grid gap-4 h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mt-10">Quel émotion vous recherchez ?</h1>
        <div className="flex justify-center space-x-4 mb-8">
          
          {emotions.map(({ icon, name }) => (
            <div
              key={name}
              className={`cursor-pointer ${selectedEmotion === name ? 'border-b-2 border-red-500' : ''}`}
              onClick={() => setSelectedEmotion(name as Emotion)}
            >
              <p>{name}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {musics.map(music => (
            <div key={music.id} className="relative">
              <HeartIcon
                className={`absolute top-2 right-2 h-6 w-6 cursor-pointer ${music.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => toggleFavorite(music)}
              />
              <img src={music.thumbnailUrl} alt={music.title} className="w-full h-auto" />
              <p className="mt-2 text-center">{music.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
  {playlists.map(playlist => (
    <div key={playlist.id} className="relative border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold truncate">{playlist.name}</h3>
        <TrashIcon
          className="h-6 w-6 cursor-pointer text-gray-500"
          onClick={() => handleDeletePlaylist(playlist.id)}
        />
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
        onClick={() => handlePlaylistClick(playlist)}
      >
        Voir Playlist
      </button>
    </div>
  ))}
</div>

        {showPlaylistModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <button
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                onClick={handleClosePlaylistModal}
              >
                <ChevronDownIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedPlaylist?.name}</h2>
              <div className="overflow-auto max-h-96">
                {selectedPlaylist?.musics.map(music => (
                  <div key={music.id} className="flex items-center mb-4">
                    <HeartIcon
                      className={`mr-2 h-6 w-6 cursor-pointer ${music.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                      onClick={() => toggleFavorite(music)}
                    />
                    <img src={music.thumbnailUrl} alt={music.title} className="w-24 h-auto" />
                    <p className="ml-2">{music.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className='flex justify-center'>
          <div className="mb-8">
            <form onSubmit={handleAddPlaylist}>
              <input
                type="text"
                placeholder="Nom de la playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="p-2 border-2 border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="mt-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Créer Playlist
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {searchResults.map(result => (
            <div key={result.id} className="relative">
              <TrashIcon
                className="absolute top-2 right-2 h-6 w-6 cursor-pointer text-gray-500"
                onClick={() => handleDeletePlaylist(result.id)}
              />
              <button
                className="absolute bottom-2 left-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                onClick={() => handlePlaylistClick(result)}
              >
                Voir Playlist
              </button>
              <p className="mt-2 text-center">{result.name}</p>
            </div>
          ))}
        </div>

        <div>
          <Link href="/hub">
            <p className="mt-10 p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-300 ease-in-out flex items-center justify-center">
              Retour au Hub
            </p>
          </Link>
        </div>
      </div>

      <ChatPopup />
    </div>
  );
};

export default MoodsPage;
