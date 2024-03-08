"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../app/firebaseConfig'; // Assurez-vous que le chemin vers firebaseConfig est correct
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

interface Track {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoId: string;
}

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  return (
    <iframe
      width="100%"
      height="100%"
      src={videoSrc}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

const userId = "user123"; // Utilisez l'identifiant de l'utilisateur connecté ici

export default function MusicApp() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm) {
      fetchTracks();
    }
    fetchUserPlaylists();
  }, [searchTerm]);

  const fetchTracks = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchTerm,
          type: 'video',
          key: 'AIzaSyCKpHu0QPxCHrzPd_ByiFClj-akdqOtLTk', // Votre clé API YouTube
        },
      });

      const fetchedTracks = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId,
      }));

      setTracks(fetchedTracks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const fetchUserPlaylists = async () => {
    try {
      const playlistsSnapshot = await getDocs(collection(db, `users/${userId}/playlists`));
      const playlists = playlistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPlaylists(playlists);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  const showPlaylistsPopup = () => {
    if (userPlaylists.length === 0) {
      alert("Veuillez créer votre propre playlist avant.");
    } else {
      setShowPlaylistDialog(true);
    }
  };

  const addToPlaylist = async (playlistId: string, trackId: string) => {
  try {
    const playlistRef = doc(db, `users/${userId}/playlists`, playlistId);
    const playlistDoc = await getDoc(playlistRef);
    if (playlistDoc.exists()) {
      const playlistData = playlistDoc.data();
      const updatedTracks = playlistData.tracks ? [...playlistData.tracks, trackId] : [trackId];
      await updateDoc(playlistRef, { tracks: updatedTracks });
      alert('Ajouté avec succès');
    } else {
      console.error('Playlist not found');
    }
  } catch (error) {
    console.error('Error adding track to playlist:', error);
  }
};

function selectTrackToAdd(track: Track): void {
  setShowPlaylistDialog(true);
}


  return (
    <div className="app bg-blue-600 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="search-bar mb-4 flex">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Recherchez des titres, artistes, humeurs..."
          className="w-full p-2 rounded text-gray-900"
        />
      </div>
      {selectedVideoId && <YouTubePlayer videoId={selectedVideoId} />}
      <div className="track-list">
      {tracks.map((track) => (
  <div key={track.id} className="track-item p-4 my-4 rounded-lg bg-blue-700 text-white flex items-center">
    <div className="flex-1">
      <p className="font-bold">{track.title} - {track.channelTitle}</p>
      <img src={track.thumbnailUrl} alt={track.title} className="w-24 h-auto ml-4" />
    </div>
    <div>
      <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300" onClick={() => selectTrackToAdd(track)}>
        Ajouter à la playlist
      </button>
      <button className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-700 transition duration-300 ml-2" onClick={() => setSelectedVideoId(track.videoId)}>
        Écouter
      </button>
    </div>
  </div>
))}
      </div>
      {showPlaylistDialog && (
  <div className="playlist-dialog">
    <h3>Choisissez une playlist</h3>
    {userPlaylists.map((playlist) => (
     <button key={playlist.id} onClick={() => {
      if (selectedVideoId) {
        addToPlaylist(playlist.id, selectedVideoId);
      } else {
        console.error("Aucune vidéo sélectionnée.");
      }
    }} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300">
      {playlist.name}
    </button>
    
    ))}
    <button onClick={() => setShowPlaylistDialog(false)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300">Fermer</button>
  </div>
)}
    
    </div>
  );
}
