"use client";
import React, { useEffect, useState, useContext } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import Sidebar from '../../../../components/Sidebar';
import { MusicPlayerContext } from '../../../../context/MusicPlayerContext';
import { HeartIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, ShareIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import MusicBar from '@/components/MusicBar';

type Music = {
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  source: string;
  url: string;  // Ajout de la propriété url
};

type Playlist = {
  id: string;
  name: string;
  musics: Music[];
};

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Music[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showFavorites, setShowFavorites] = useState<{ [key: string]: boolean }>({});
  const [showShareDialog, setShowShareDialog] = useState<{ show: boolean, playlist?: Playlist }>({ show: false });
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const { setCurrentTrack } = useContext(MusicPlayerContext);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        fetchPlaylists();
        fetchFavorites(user.uid);
        fetchJoinedGroups(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPlaylists = async () => {
    const playlistsCollection = collection(db, 'playlists');
    const playlistsSnapshot = await getDocs(playlistsCollection);
    const fetchedPlaylists = playlistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
    setPlaylists(fetchedPlaylists);
  };

  const fetchFavorites = async (userId: string) => {
    const favoritesCollection = collection(db, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesCollection);
    const fetchedFavorites = favoritesSnapshot.docs.map(doc => doc.data() as Music);
    setFavorites(fetchedFavorites);
  };

  const fetchJoinedGroups = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setJoinedGroups(userDoc.data().joinedGroups || []);
    }
  };

  const setCurrentMusicInDB = async (music: Music) => {
    try {
      await setDoc(doc(db, "musicPlayer", "currentTrack"), music);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la musique actuelle :", error);
    }
  };

  const createPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPlaylistRef = doc(collection(db, 'playlists'));
    const newPlaylist = {
      id: newPlaylistRef.id,
      name: newPlaylistName,
      musics: [],
    };
    await setDoc(newPlaylistRef, newPlaylist);
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
  };

  const deletePlaylist = async (playlistId: string) => {
    const playlistRef = doc(db, 'playlists', playlistId);
    await deleteDoc(playlistRef);
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  };

  const addToPlaylist = async (playlistId: string, track: Music) => {
    const playlistRef = doc(db, 'playlists', playlistId);
    const playlistDoc = await getDoc(playlistRef);
    if (playlistDoc.exists()) {
      const playlistData = playlistDoc.data() as Playlist;
      const updatedMusics = [...playlistData.musics, track];
      await updateDoc(playlistRef, { musics: updatedMusics });
      setPlaylists(playlists.map(playlist => playlist.id === playlistId ? { ...playlist, musics: updatedMusics } : playlist));
    }
  };

  const removeFromPlaylist = async (playlistId: string, trackId: string) => {
    const playlistRef = doc(db, 'playlists', playlistId);
    const playlistDoc = await getDoc(playlistRef);
    if (playlistDoc.exists()) {
      const playlistData = playlistDoc.data() as Playlist;
      const updatedMusics = playlistData.musics.filter(music => music.id !== trackId);
      await updateDoc(playlistRef, { musics: updatedMusics });
      setPlaylists(playlists.map(playlist => playlist.id === playlistId ? { ...playlist, musics: updatedMusics } : playlist));
    }
  };

  const toggleFavorites = (playlistId: string) => {
    setShowFavorites(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  };

  const sharePlaylist = (playlist: Playlist) => {
    setShowShareDialog({ show: true, playlist });
  };

  const handleShare = async (shareInApp: boolean, groupId?: string) => {
    if (!showShareDialog.playlist) return;

    if (shareInApp && groupId) {
      const message = {
        text: `Check out this playlist: ${showShareDialog.playlist.name}`,
        sender: user.email,
        timestamp: new Date(),
        playlistId: showShareDialog.playlist.id,
      };
      await setDoc(doc(db, `groups/${groupId}/messages`, `${Date.now()}`), message);
    } else {
      const shareData = {
        title: showShareDialog.playlist.name,
        text: `Check out this playlist: ${showShareDialog.playlist.name}`,
        url: window.location.href,
      };
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing playlist:", error);
      }
    }

    setShowShareDialog({ show: false });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Sidebar fixée */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-20 shadow-lg">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center p-10 ml-64 overflow-y-auto">
        <h1 className="text-5xl font-extrabold text-white mb-8">Mes Playlists</h1>
        <form onSubmit={createPlaylist} className="mb-8 w-full max-w-lg flex items-center space-x-4">
          <input
            type="text"
            placeholder="Nom de la playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Créer
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl text-black">
          {playlists && playlists.length > 0 ? playlists.map(playlist => (
            <div key={playlist.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{playlist.name}</h3>
                <div className="flex items-center space-x-4">
                  <TrashIcon className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition duration-300" onClick={() => deletePlaylist(playlist.id)} />
                  <ShareIcon className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 transition duration-300" onClick={() => sharePlaylist(playlist)} />
                </div>
              </div>
              <div className="space-y-4">
                {playlist.musics && playlist.musics.length > 0 ? playlist.musics.map(music => (
                  <div key={music.id} className="flex items-center space-x-4">
                    <img src={music.thumbnailUrl} alt={music.title} className="w-16 h-16 rounded-lg shadow-md" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{music.title}</p>
                      <p className="text-gray-500 text-sm">{music.artist}</p>
                    </div>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                      onClick={() => removeFromPlaylist(playlist.id, music.id)}
                    >
                      Retirer
                    </button>
                    <button
                      className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                      onClick={() => {
                        setCurrentMusicInDB(music);
                        setCurrentTrack(music);
                      }}
                    >
                      Écouter
                    </button>
                  </div>
                )) : <p className="text-gray-500">Aucune musique dans cette playlist</p>}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2 flex items-center cursor-pointer text-blue-500" onClick={() => toggleFavorites(playlist.id)}>
                  Ajouter des musiques depuis les favoris
                  {showFavorites[playlist.id] ? (
                    <ChevronUpIcon className="w-5 h-5 ml-2" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                  )}
                </h4>
                {showFavorites[playlist.id] && (
                  <div className="space-y-4">
                    {favorites && favorites.length > 0 ? favorites.map(music => (
                      <div key={music.id} className="flex items-center space-x-4">
                        <img src={music.thumbnailUrl} alt={music.title} className="w-12 h-12 rounded-lg shadow-md" />
                        <div className="flex-1">
                          <p className="font-semibold">{music.title}</p>
                          <p className="text-gray-500 text-sm">{music.artist}</p>
                        </div>
                        <button className="bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300" onClick={() => addToPlaylist(playlist.id, music)}>
                          Ajouter
                        </button>
                      </div>
                    )) : <p className="text-gray-500">Aucun favori à ajouter</p>}
                  </div>
                )}
              </div>
            </div>
          )) : <p className="text-white text-lg">Aucune playlist créée</p>}
        </div>
        <Link href="/hub">
          <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer">
            Retour au Hub
          </p>
        </Link>
      </div>
      {showShareDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Partager la playlist</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              onClick={() => handleShare(false)}
            >
              Partager à l extérieur de l application
            </button>
            {joinedGroups.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Partager dans un groupe</h3>
                {joinedGroups.map((groupName, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md mb-2 w-full text-left hover:bg-gray-300 transition duration-300"
                    onClick={() => handleShare(true, groupName)}
                  >
                    {groupName}
                  </button>
                ))}
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              onClick={() => setShowShareDialog({ show: false })}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full z-30">
        <MusicBar />
      </div>
    </div>
  );
};

export default PlaylistsPage;
