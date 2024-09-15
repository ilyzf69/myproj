"use client";
import React, { useEffect, useState, useContext } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import Sidebar from '../../../../components/Sidebar';
import { MusicPlayerContext } from '../../../../context/MusicPlayerContext';
import { HeartIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, ShareIcon, PlusCircleIcon } from '@heroicons/react/solid';
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
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const { setCurrentTrack } = useContext(MusicPlayerContext);
  const [user, setUser] = useState<any>(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

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

  const createPlaylist = async () => {
    if (user && newPlaylistName) {
      const newPlaylistRef = doc(collection(db, 'playlists'));
      const newPlaylist = {
        id: newPlaylistRef.id,
        name: newPlaylistName,
        musics: [],
      };
      await setDoc(newPlaylistRef, newPlaylist);
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setShowCreatePopup(false);
    }
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

  return (
    <div className="relative flex h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <Sidebar />

      <div className="flex-1 flex flex-col items-center p-6">
        <h1 className="text-5xl font-extrabold text-white mb-8">Mes Playlists</h1>

        <div className="mb-6 w-full max-w-2xl flex">
          <input
            type="text"
            className="w-full p-3 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring focus:border-white placeholder-gray-300 text-gray-700"
            placeholder="Nom de la playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button
            className="ml-2 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition"
            onClick={() => setShowCreatePopup(true)}
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-4xl font-bold text-white mt-10 mb-6">Vos playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl text-black">
          {playlists.length > 0 ? playlists.map((playlist) => (
            <div key={playlist.id} className="p-6 bg-white bg-opacity-20 rounded-lg shadow-lg flex flex-col">
              <div className="flex items-center mb-2">
                <HeartIcon className="w-10 h-10 text-blue-500 mr-4" />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white">{playlist.name}</h3>
                  <p className="text-white">Musiques : {playlist.musics.length}</p>
                </div>
              </div>
              <div className="space-y-4">
                {playlist.musics.length > 0 ? playlist.musics.map(music => (
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
            </div>
          )) : <p className="text-white text-lg">Vous n'avez aucune playlist</p>}
        </div>

        <Link href="/hub">
          <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer">
            Retour au Hub
          </p>
        </Link>
      </div>

      {showCreatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Créer une Playlist</h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowCreatePopup(false)}
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Nom de la playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
              onClick={createPlaylist}
            >
              Créer
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
