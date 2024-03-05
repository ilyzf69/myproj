"use client"
import React, { useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';

type Music = {
  id: string;
  title: string;
  thumbnailUrl: string;
};

type Playlist = {
  id: string;
  name: string;
  musics: Music[];
};

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<Music[]>([]);

  const handleAddPlaylist = () => {
    const newPlaylist: Playlist = {
      id: `${Date.now()}`,
      name: newPlaylistName,
      musics: selectedMusic,
    };
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName(''); 
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Mes Playlists</h1>
          <p className="mt-2 text-lg">Explorez et gérez vos playlists ici.</p>

          <input
            type="text"
            placeholder="Nom de la nouvelle playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="mt-4 p-2 border-2 border-gray-300"
          />
          <button onClick={handleAddPlaylist} className="mt-2 p-2 bg-red-500 text-white rounded">Créer</button>

          {playlists.map((playlist) => (
            <div key={playlist.id} className="mt-4">
              <h2 className="text-lg font-semibold">{playlist.name}</h2>
              {playlist.musics.map((music) => (
                <div key={music.id} className="mt-2">
                  {music.title}
                </div>
              ))}
              <button className="mt-2 p-2 bg-green-500 text-white rounded">Partager</button>
            </div>
          ))}
        </div>

        <Link href="/hub">
          <p className="mt-10 p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center">
            <span>Retour au Hub</span>
          </p>
        </Link>
      </div>
      <ChatPopup/>
    </div>
  );
};

export default PlaylistsPage;
