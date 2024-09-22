"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { db, auth } from '../app/firebaseConfig';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { HeartIcon, PlayIcon, SearchIcon, ShareIcon, PlusCircleIcon } from '@heroicons/react/solid';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import getSpotifyAccessToken from './spotifyService';

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
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false); // Pour le popup de succès

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
      setTracks([]); // Clear the results if search is empty
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
      console.error('Erreur lors de la récupération des données YouTube :', error);
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
      console.error('Erreur lors de la récupération des données Spotify :', error);
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
      setPlaylists(playlists);
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists utilisateur :', error);
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
      console.error('Erreur lors de la récupération des recommandations :', error);
    }
  };

  const fetchEmotionTracks = async (emotion: string) => {
    try {
      const response = await axios.get(`/api/emotions?emotion=${emotion}`);
      setEmotionTracks(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des musiques basées sur l\'émotion :', error);
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
        // Utilisation du champ 'musics' au lieu de 'tracks'
        const updatedMusics = Array.isArray(playlistData.musics) ? [...playlistData.musics, track] : [track];
        await updateDoc(playlistRef, { musics: updatedMusics });
        // Mise à jour de l'état local après ajout à la playlist
        setPlaylists(playlists.map(pl => pl.id === playlistId ? { ...pl, musics: updatedMusics } : pl));
        setShowSuccessPopup(true); // Afficher le popup de succès
        setTimeout(() => {
          setShowSuccessPopup(false); // Masquer le popup après 2 secondes
        }, 2000);
      } else {
        console.error('Playlist introuvable');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la piste à la playlist :', error);
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
      console.error('Erreur lors de la modification des favoris :', error);
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
      console.error('Erreur lors du partage de la musique dans le groupe :', error);
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
      console.error('Erreur lors du partage externe de la musique :', error);
    }
  };

  const playTrack = async (track: Track) => {
    // Envoi des données de la piste en cours de lecture dans la BDD pour le MusicBar
    try {
      await setDoc(doc(db, 'musicPlayer', 'currentTrack'), {
        id: track.id,
        title: track.title,
        artist: track.artist,
        thumbnailUrl: track.thumbnailUrl,
        url: track.url,
        source: track.source,
      });
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la musique actuelle :', error);
    }
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
          ) : null}
        </div>

        {/* Popup de succès */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
              Musique bien ajoutée à la playlist
            </div>
          </div>
        )}

        {/* Dialogues de playlist et partage */}
        {showPlaylistDialog && selectedTrack && (
          <div className="playlist-dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-black mb-4">Choisissez une playlist</h3>
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <button key={playlist.id} onClick={() => {
                    addToPlaylist(playlist.id, selectedTrack);
                    setShowPlaylistDialog(false);
                  }} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-2 w-full">
                    {playlist.name}
                  </button>
                ))
              ) : (
                <>
                  <p className="text-red-500 mb-4">Aucune playlist trouvée.</p>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300 w-full"
                    onClick={async () => {
                      const newPlaylistRef = doc(collection(db, `users/${userId}/playlists`));
                      await setDoc(newPlaylistRef, { name: 'Playlist 1', musics: [] });
                      setPlaylists([...playlists, { id: newPlaylistRef.id, name: 'Playlist 1', musics: [] }]);
                    }}
                  >
                    Créer une playlist "Playlist 1"
                  </button>
                </>
              )}
              <button onClick={() => setShowPlaylistDialog(false)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300 w-full">
                Fermer
              </button>
            </div>
          </div>
        )}

        {showShareDialog && selectedTrack && (
          <div className="share-dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-black mb-4">Partager la musique</h3>
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
                Partager à l extérieur de l application
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
    </div>
  );
};

export default ActivityFeed;
