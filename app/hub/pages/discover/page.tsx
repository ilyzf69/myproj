"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { MusicPlayerContext } from '../../../../context/MusicPlayerContext';
import { db } from '../../../firebaseConfig';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

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
  { icon: HeartIcon, name: 'Amour', query: 'love songs' },
  { icon: EmojiHappyIcon, name: 'Joyeux', query: 'happy songs' },
  { icon: EmojiSadIcon, name: 'Triste', query: 'sad songs' },
  { icon: LightningBoltIcon, name: 'Énergique', query: 'energetic songs' },
];

const MoodsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [musics, setMusics] = useState<Music[]>([]);
  const { setCurrentTrack } = useContext(MusicPlayerContext);

  useEffect(() => {
    if (selectedEmotion) {
      fetchTracks(selectedEmotion);
    }
  }, [selectedEmotion]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchTracks = async (emotion: Emotion) => {
    const query = emotions.find(e => e.name === emotion)?.query || '';
    if (query) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            maxResults: 10,
            q: query,
            type: 'video',
            key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
          },
        });

        const fetchedTracks: Music[] = response.data.items.map((item: { id: { videoId: any; }; snippet: { title: any; thumbnails: { default: { url: any; }; }; }; }) => ({
          videoId: item.id.videoId,
          id: item.id.videoId,
          title: item.snippet.title,
          artist: 'Unknown Artist',
          thumbnailUrl: item.snippet.thumbnails.default.url,
          isFavorite: false,
        }));

        const favoriteTracks = await getFavorites();

        setMusics(fetchedTracks.map(track => ({
          ...track,
          isFavorite: favoriteTracks.some(fav => fav.id === track.id),
        })));
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    }
  };

  const toggleFavorite = async (music: Music) => {
    const musicRef = doc(db, "favorites", music.id);

    try {
      if (music.isFavorite) {
        await deleteDoc(musicRef);
      } else {
        await setDoc(musicRef, { ...music, isFavorite: true });
      }

      setMusics(musics.map(m => m.id === music.id ? { ...m, isFavorite: !m.isFavorite } : m));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const getFavorites = async () => {
    const favoritesCollection = await getDocs(collection(db, "favorites"));
    return favoritesCollection.docs.map(doc => doc.data() as Music);
  };

  const fetchFavorites = async () => {
    try {
      const favorites = await getFavorites();
      setMusics(prevMusics => prevMusics.map(music => ({
        ...music,
        isFavorite: favorites.some(fav => fav.id === music.id),
      })));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
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
              <p className="mr-2">{music.title}</p>
              
            </div>
          ))}
        </div>
        <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer">
          <Link href="/hub">Retour au Hub</Link>
        </p>
      </div>
      <ChatPopup />
    </div>
  );
};

export default MoodsPage;
