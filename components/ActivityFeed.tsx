"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db, auth } from '../app/firebaseConfig';
import logoYT from '../image/youtube.png';
import logoSP from '../image/spotify.png';
import logoALL from '../image/all.png';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import getSpotifyAccessToken from './spotifyService';
import { onAuthStateChanged } from "firebase/auth";
import { HeartIcon, PauseIcon, SearchIcon, ShareIcon } from '@heroicons/react/solid';

interface Track {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoId: string;
  source: string;
  isFavorite: boolean;
}

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  return (
    <iframe
      width="100%"
      height="400px"
      src={videoSrc}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

const SpotifyPlayer = ({ trackId }: { trackId: string }) => {
  const embedSrc = `https://open.spotify.com/embed/track/${trackId}`;
  return (
    <iframe
      src={embedSrc}
      width="100%"
      height="400px"
      frameBorder="0"
      allowTransparency
      allow="encrypted-media"
    ></iframe>
  );
};

export default function ActivityFeed() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [source, setSource] = useState('all');
  const [userId, setUserId] = useState<string | null>(null);
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
    if (searchTerm) {
      fetchTracks();
    }
  }, [searchTerm, source]);

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
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId,
        source: 'youtube',
        isFavorite: false,
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
        channelTitle: item.artists[0].name,
        thumbnailUrl: item.album.images[0].url,
        videoId: item.id,
        source: 'spotify',
        isFavorite: false,
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
        url: window.location.href, // Ou toute autre URL pointant vers la musique
      };
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing track outside app:', error);
    }
  };

  return (
    <div className="app bg-gray-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
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
          onClick={() => setSource('all')}
          className={`p-2 rounded-full ${source === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <img src={logoALL.src} alt="ALL" className="h-12 w-12" />
        </button>
        <button
          onClick={() => setSource('youtube')}
          className={`p-2 rounded-full ${source === 'youtube' ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <img src={logoYT.src} alt="YouTube" className="h-12 w-12" />
        </button>
        <button
          onClick={() => setSource('spotify')}
          className={`p-2 rounded-full ${source === 'spotify' ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <img src={logoSP.src} alt="Spotify" className="h-12 w-12" />
        </button>
      </div>
      <div className="track-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="track-item p-4 bg-white rounded-lg shadow-md flex flex-col items-start">
            <img src={track.thumbnailUrl} alt={track.title} className="w-full h-40 object-cover rounded mb-4" />
            <div className="flex-1">
              <p className="font-bold text-gray-900">{track.title} - {track.channelTitle}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  className={`p-1 rounded ${track.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-900'}`}
                  onClick={() => toggleFavorite(track)}
                >
                  <HeartIcon className="w-6 h-6" />
                </button>
                <button
                  className="p-1 rounded bg-green-500 text-white"
                  onClick={() => selectTrackToAdd(track)}
                >
                  <PauseIcon className="w-6 h-6" />
                </button>
                <button
                  className="p-1 rounded bg-blue-500 text-white"
                  onClick={() => shareTrack(track)}
                >
                  <ShareIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedTrack && showPlaylistDialog && (
        <div className="playlist-dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="mb-4">Choisissez une playlist</h3>
            {userPlaylists.length > 0 ? (
              userPlaylists.map((playlist) => (
                <button key={playlist.id} onClick={() => {
                  addToPlaylist(playlist.id, selectedTrack);
                  setShowPlaylistDialog(false);
                }} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-2 w-full">
                  {playlist.name}
                </button>
              ))
            ) : (
              <p className="text-red-500">Aucune playlist trouvée. Veuillez en créer une d'abord.</p>
            )}
            <button onClick={() => setShowPlaylistDialog(false)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300 w-full">
              Fermer
            </button>
          </div>
        </div>
      )}
      {selectedTrack && showShareDialog && (
        <div className="share-dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="mb-4">Partager la musique</h3>
            {groups.map((group) => (
              <button key={group.id} onClick={() => {
                shareInGroup(group.id, selectedTrack);
                setShowShareDialog(false);
              }} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300 mb-2 w-full">
                Partager dans {group.name}
              </button>
            ))}
            <button
              onClick={() => {
                shareOutsideApp(selectedTrack);
                setShowShareDialog(false);
              }}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
            >
              Partager à l'extérieur de l'application
            </button>
            <div className="my-2"></div>
            <button
              onClick={() => setShowShareDialog(false)}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300 w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
