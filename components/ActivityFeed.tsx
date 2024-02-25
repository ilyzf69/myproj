'use client'
import React, { useState, useEffect } from 'react';

interface Track {
  title: string;
  artist: string;
}

export default function MusicApp() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    const fetchedTracks: Track[] = [
      { title: 'Track 1', artist: 'Artist 1' },
      { title: 'Track 2', artist: 'Artist 2' },
    ];
    setTracks(fetchedTracks);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="app bg-blue-600 p-6 rounded-lg shadow-lg">
      <div className="search-bar mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Recherchez des titres, artistes, humeurs..."
          className="w-full p-2 rounded-lg text-gray-900"
        />
      </div>
      <div className="track-list">
        {tracks.map((track, index) => (
          <div key={index} className="track-item p-4 my-4 rounded-lg bg-blue-700 text-white">
            <p className="font-bold">{track.title} - {track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
