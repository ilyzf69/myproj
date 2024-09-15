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
import YouTube from 'react-youtube';

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
  const { setCurrentTrack, setIsPlaying, setTitleMusic, setThumbnailUrl } = useMusicPlayer();
  const [userId, setUserId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);  // Stocke l'ID de la vidéo actuellement jouée

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
    setCurrentTrack(music);  // Définit la musique actuelle dans la MusicBar
    setTitleMusic(music.title);  // Met à jour le titre de la musique dans la MusicBar
    setThumbnailUrl(music.thumbnailUrl);  // Met à jour la miniature de la musique dans la MusicBar
    setIsPlaying(true);
    setPlayingVideoId(music.videoId);  // Définir l'ID de la vidéo en lecture
  };

  const closeVideo = () => {
    setPlayingVideoId(null);  // Ferme le lecteur YouTube
  };

  const loadMoreTracks = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Overlay flouté si une vidéo est en lecture */}
      {playingVideoId && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeVideo}
              className="absolute top-0 right-0 m-4 text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
            >
              Fermer
            </button>
            <YouTube videoId={playingVideoId} className="w-full max-w-full h-auto" />
          </div>
        </div>
      )}

      {/* Sidebar fixée */} 
      <div className={`w-full lg:w-64 text-white ${playingVideoId ? 'filter blur-sm' : ''}`}>
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className={`flex-1 flex flex-col items-center p-4 lg:p-10 overflow-y-auto ${playingVideoId ? 'filter blur-sm' : ''}`}>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 lg:mb-8">Découvrir</h1>
        <p className="text-lg lg:text-xl text-white mb-6 lg:mb-10 text-center">Musique basée sur votre humeur actuelle : {selectedEmotion}</p>
        <div className="track-list w-full max-w-4xl text-black grid grid-cols-1 md:grid-cols-2 gap-6">
          {musics.slice(0, visibleCount).map(music => (
            <div key={music.id} className="track-item bg-white p-4 rounded-lg shadow-md flex items-center">
              <HeartIcon
                className={`mr-4 h-8 w-8 cursor-pointer ${music.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
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
            className="mt-6 lg:mt-10 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Voir Plus
          </button>
        )}

        <Link href="/hub">
          <p className="mt-6 lg:mt-10 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer">
            Retour au Hub
          </p>
        </Link>
      </div>
      
      {/* MusicBar fixée en bas */}
      <div className={`fixed bottom-0 left-0 w-full z-30 ${playingVideoId ? 'filter blur-sm' : ''}`}>
        <MusicBar />
      </div>
    </div>
  );
};

export default DiscoverPage;
