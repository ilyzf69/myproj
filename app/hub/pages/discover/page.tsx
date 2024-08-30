"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/solid';
import { db, auth } from '../../../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import axios from 'axios';
import MusicBar from '../../../../components/MusicBar';
import { onAuthStateChanged } from "firebase/auth";
import { useMusicPlayer } from '../../../../context/MusicPlayerContext';

type Music = {
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  source: string;
  url: string;
};

const emotions = {
  '❤️': 'love songs',
  '😀': 'happy songs',
  '😢': 'sad songs',
  '⚡': 'energetic songs',
};

const DiscoverPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [musics, setMusics] = useState<Music[]>([]);
  const [favorites, setFavorites] = useState<Music[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const { setCurrentTrack, setIsPlaying } = useMusicPlayer();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        fetchFavorites(user.uid);
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then(docSnap => {
          if (docSnap.exists()) {
            const userMood = docSnap.data().mood;
            setSelectedEmotion(userMood);
            if (userMood) {
              fetchTracks(userMood);
            }
          } else {
            console.log("No such document!");
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (userId: string) => {
    const favoritesCollection = collection(db, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesCollection);
    const fetchedFavorites = favoritesSnapshot.docs.map(doc => doc.data() as Music);
    setFavorites(fetchedFavorites);
  };

  const fetchTracks = async (mood: string) => {
    const query = emotions[mood as keyof typeof emotions];
    if (query) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            maxResults: 20,
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
          source: 'youtube',
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        const updatedTracks = fetchedTracks.map(track => {
          const isFav = favorites.some(fav => fav.id === track.id);
          return { ...track, isFavorite: isFav };
        });

        setMusics(updatedTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    }
  };

  const toggleFavorite = async (music: Music) => {
    if (!userId) return;

    const musicRef = doc(db, `users/${userId}/favorites`, music.id);

    try {
      if (music.isFavorite) {
        await deleteDoc(musicRef);
      } else {
        await setDoc(musicRef, { ...music, isFavorite: true });
      }

      setMusics(musics.map(m => m.id === music.id ? { ...m, isFavorite: !m.isFavorite } : m));
      fetchFavorites(userId);  // Refresh favorites list after adding/removing
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handlePlay = (music: Music) => {
    setCurrentTrack(music);
    setIsPlaying(true);
  };

  const loadMoreTracks = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Sidebar fixée */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-20 shadow-lg">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center p-10 ml-64 overflow-y-auto">
        <h1 className="text-5xl font-extrabold text-white mb-8">Découvrir</h1>
        <p className="text-xl text-white mb-10">Musique basée sur votre humeur actuelle : {selectedEmotion}</p>
        <div className="track-list mt-8 w-full max-w-4xl text-black">
          {musics.slice(0, visibleCount).map(music => (
            <div key={music.id} className="track-item mb-6 flex items-center bg-white shadow-md p-6 rounded-lg">
              <HeartIcon
                className={`h-8 w-8 cursor-pointer ${music.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => toggleFavorite(music)}
              />
              <img src={music.thumbnailUrl} alt={music.title} className="inline-block mr-4 rounded-lg" style={{ width: '80px', height: '80px' }} />
              <div className="flex-1">
                <p className="text-xl font-bold">{music.title}</p>
                <p className="text-sm text-gray-500">{music.artist}</p>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => handlePlay(music)}
              >
                Écouter
              </button>
            </div>
          ))}
        </div>

        {/* Bouton Voir Plus */}
        {visibleCount < musics.length && (
          <button
            onClick={loadMoreTracks}
            className="mt-10 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Voir Plus
          </button>
        )}

        <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer">
          <Link href="/hub">Retour au Hub</Link>
        </p>
      </div>
      
      {/* MusicBar fixée en bas */}
      <div className="fixed bottom-0 left-0 w-full z-30">
        <MusicBar />
      </div>
    </div>
  );
};

export default DiscoverPage;
