"use client";
import React, { useEffect, useState, useContext } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import Sidebar from '../../../../components/Sidebar';
import { MusicPlayerContext } from '../../../../context/MusicPlayerContext';
import { HeartIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, ShareIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';

type Music = {
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  source: string;
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center p-10">
        <h1 className="text-4xl font-bold text-green-500 mb-5">Mes Playlists</h1>
        <form onSubmit={createPlaylist} className="mb-5">
          <input
            type="text"
            placeholder="Nom de la playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="p-2 border-2 border-gray-300 rounded-md mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Créer</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists && playlists.length > 0 ? playlists.map(playlist => (
            <div key={playlist.id} className="p-4 bg-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{playlist.name}</h3>
                <div className="flex items-center space-x-2">
                  <TrashIcon className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => deletePlaylist(playlist.id)} />
                  <ShareIcon className="h-6 w-6 text-blue-500 cursor-pointer" onClick={() => sharePlaylist(playlist)} />
                </div>
              </div>
              <div className="space-y-2">
                {playlist.musics && playlist.musics.length > 0 ? playlist.musics.map(music => (
                  <div key={music.id} className="flex items-center space-x-2">
                    <img src={music.thumbnailUrl} alt={music.title} className="w-12 h-12" />
                    <div className="flex-1">
                      <p className="font-semibold">{music.title}</p>
                      <p className="text-sm text-gray-600">{music.artist}</p>
                    </div>
                    <button className="bg-red-500 text-white p-1 rounded" onClick={() => removeFromPlaylist(playlist.id, music.id)}>Retirer</button>
                  </div>
                )) : <p>Aucune musique dans cette playlist</p>}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2 flex items-center cursor-pointer" onClick={() => toggleFavorites(playlist.id)}>
                  Ajouter des musiques depuis les favoris
                  {showFavorites[playlist.id] ? (
                    <ChevronUpIcon className="w-5 h-5 ml-2" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ml-2" />
                  )}
                </h4>
                {showFavorites[playlist.id] && (
                  <div className="space-y-2">
                    {favorites && favorites.length > 0 ? favorites.map(music => (
                      <div key={music.id} className="flex items-center space-x-2">
                        <img src={music.thumbnailUrl} alt={music.title} className="w-12 h-12" />
                        <div className="flex-1">
                          <p className="font-semibold">{music.title}</p>
                          <p className="text-sm text-gray-600">{music.artist}</p>
                        </div>
                        <button className="bg-green-500 text-white p-1 rounded" onClick={() => addToPlaylist(playlist.id, music)}>Ajouter</button>
                      </div>
                    )) : <p>Aucun favori à ajouter</p>}
                  </div>
                )}
              </div>
            </div>
          )) : <p>Aucune playlist créée</p>}
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
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleShare(false)}
            >
              Partager à l'extérieur de l'application
            </button>
            {joinedGroups.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Partager dans un groupe</h3>
                {joinedGroups.map((groupName, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded mb-2 w-full text-left"
                    onClick={() => handleShare(true, groupName)}
                  >
                    {groupName}
                  </button>
                ))}
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowShareDialog({ show: false })}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
