"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { db, auth } from '../app/firebaseConfig';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import getSpotifyAccessToken from './spotifyService';
import { onAuthStateChanged } from "firebase/auth";
import { HeartIcon, PlayIcon, SearchIcon, ShareIcon } from '@heroicons/react/solid';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoId: string;
  source: string;
  isFavorite: boolean;
  url: string;
}

const ActivityFeed = ({ userMood }: { userMood: string }) => {
  const { setCurrentTrack, setIsPlaying } = useMusicPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [source, setSource] = useState('all');
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [emotionTracks, setEmotionTracks] = useState<Track[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserPlaylists(user.uid);
        fetchFavorites(user.uid);
        fetchGroups();
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Si le champ de recherche est vide, vider les musiques affichées
      setTracks([]);
    } else {
      fetchTracks();
    }
  }, [searchTerm, source]);

  useEffect(() => {
    fetchRecommendedTracks();
    if (userMood) {
      fetchEmotionTracks(userMood);
    }
  }, [userMood]);

  const fetchTracks = async () => {
    setTracks([]);
    setSelectedTrack(null);
    if (source === 'youtube' || source === 'all') {
      await fetchYouTubeTracks();
    }
    if (source === 'spotify' || source === 'all') {
      await fetchSpotifyTracks();
    }
  };

  const fetchYouTubeTracks = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchTerm,
          type: 'video',
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
        },
      });

      const fetchedTracks = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId,
        source: 'youtube',
        isFavorite: false,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      setTracks(fetchedTracks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSpotifyTracks = async () => {
    try {
      const accessToken = await getSpotifyAccessToken();
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: searchTerm,
          type: 'track',
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedTracks = response.data.tracks.items.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: item.artists[0].name,
        thumbnailUrl: item.album.images[0].url,
        videoId: item.id,
        source: 'spotify',
        isFavorite: false,
        url: item.external_urls.spotify,
      }));

      setTracks(fetchedTracks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFavorites = async (userId: string) => {
    const favoritesCollection = collection(db, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesCollection);
    const fetchedFavorites = favoritesSnapshot.docs.map(doc => doc.data() as Track);
    setTracks(prevTracks => prevTracks.map(track => ({
      ...track,
      isFavorite: fetchedFavorites.some(fav => fav.id === track.id)
    })));
  };

  const fetchUserPlaylists = async (userId: string) => {
    try {
      const playlistsSnapshot = await getDocs(collection(db, `users/${userId}/playlists`));
      const playlists = playlistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPlaylists(playlists);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  const fetchGroups = async () => {
    const groupsCollection = collection(db, 'groups');
    const groupsSnapshot = await getDocs(groupsCollection);
    const fetchedGroups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGroups(fetchedGroups);
  };

  const fetchRecommendedTracks = async () => {
    try {
      const response = await axios.get('/api/recommended');
      setRecommendedTracks(response.data);
    } catch (error) {
      console.error('Error fetching recommended tracks:', error);
    }
  };

  const fetchEmotionTracks = async (emotion: string) => {
    try {
      const response = await axios.get(`/api/emotions?emotion=${emotion}`);
      setEmotionTracks(response.data);
    } catch (error) {
      console.error('Error fetching emotion tracks:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addToPlaylist = async (playlistId: string, track: Track) => {
    try {
      const playlistRef = doc(db, `users/${userId}/playlists`, playlistId);
      const playlistDoc = await getDoc(playlistRef);
      if (playlistDoc.exists()) {
        const playlistData = playlistDoc.data();
        const updatedTracks = playlistData.tracks ? [...playlistData.tracks, track] : [track];
        await updateDoc(playlistRef, { tracks: updatedTracks });
        alert('Ajouté avec succès');
      } else {
        console.error('Playlist not found');
      }
    } catch (error) {
      console.error('Error adding track to playlist:', error);
    }
  };

  const toggleFavorite = async (track: Track) => {
    if (!userId) return;

    try {
      const favoriteRef = doc(db, `users/${userId}/favorites`, track.id);
      const favoriteDoc = await getDoc(favoriteRef);

      if (favoriteDoc.exists()) {
        await deleteDoc(favoriteRef);
        setTracks(tracks.map(t => (t.id === track.id ? { ...t, isFavorite: false } : t)));
      } else {
        await setDoc(favoriteRef, { ...track, isFavorite: true });
        setTracks(tracks.map(t => (t.id === track.id ? { ...t, isFavorite: true } : t)));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const selectTrackToAdd = (track: Track) => {
    setSelectedTrack(track);
    setShowPlaylistDialog(true);
  };

  const shareTrack = (track: Track) => {
    setSelectedTrack(track);
    setShowShareDialog(true);
  };

  const shareInGroup = async (groupId: string, track: Track) => {
    try {
      const message = {
        text: `Écoutez cette musique : ${track.title}`,
        sender: userId,
        timestamp: new Date(),
        track,
      };
      await setDoc(doc(db, `groups/${groupId}/messages`, `${Date.now()}`), message);
      alert('Musique partagée dans le groupe avec succès');
    } catch (error) {
      console.error('Error sharing track in group:', error);
    }
  };

  const shareOutsideApp = async (track: Track) => {
    try {
      const shareData = {
        title: track.title,
        text: `Écoutez cette musique : ${track.title}`,
        url: window.location.href,
      };
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing track outside app:', error);
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="search-bar mb-6 flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Recherchez des titres, artistes, humeurs..."
            className="w-full p-3 rounded text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <SearchIcon className="w-8 h-8 text-gray-500 ml-4" />
        </div>
        <div className="source-buttons mb-6 flex justify-around">
          <button
            onClick={() => setSource('youtube')}
            className={`p-2 rounded-full ${source === 'youtube' ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            YouTube
          </button>
          <button
            onClick={() => setSource('spotify')}
            className={`p-2 rounded-full ${source === 'spotify' ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            Spotify
          </button>
          <button
            onClick={() => setSource('all')}
            className={`p-2 rounded-full ${source === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            Tous
          </button>
        </div>
        <div className="track-list grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <div key={track.id} className="track-item p-4 bg-white rounded-lg shadow-md flex flex-col items-start">
                <img src={track.thumbnailUrl} alt={track.title} className="w-full h-40 object-cover rounded mb-4" />
                <p className="font-bold text-gray-900">{track.title} - {track.artist}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="p-1 rounded bg-green-500 text-white"
                    onClick={() => playTrack(track)}
                  >
                    <PlayIcon className="w-6 h-6" />
                  </button>
                  <button
                    className={`p-1 rounded ${track.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-900'}`}
                    onClick={() => toggleFavorite(track)}
                  >
                    <HeartIcon className="w-6 h-6" />
                  </button>
                  <button
                    className="p-1 rounded bg-blue-500 text-white"
                    onClick={() => selectTrackToAdd(track)}
                  >
                    Ajouter à Playlist
                  </button>
                  <button
                    className="p-1 rounded bg-purple-500 text-white"
                    onClick={() => shareTrack(track)}
                  >
                    <ShareIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucun résultat à afficher. Veuillez effectuer une recherche.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
