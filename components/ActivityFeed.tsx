'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Track {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export default function MusicApp() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      fetchTracks();
    }
  }, [searchTerm]);

  const fetchTracks = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchTerm,
          type: 'video',
          key: 'AIzaSyCw3tcO0cLDtoM-PeixLqQX2NQ5HTiIqyw',
        },
      });

      const fetchedTracks = response.data.items.map((item: { id: { videoId: any; }; snippet: { title: any; channelTitle: any; thumbnails: { default: { url: any; }; }; }; }) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
      }));

      setTracks(fetchedTracks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
        {tracks.map((track) => (
          <div key={track.id} className="track-item p-4 my-4 rounded-lg bg-blue-700 text-white">
            <p className="font-bold">{track.title} - {track.channelTitle}</p>
            <img src={track.thumbnailUrl} alt={track.title} style={{ width: '100px', height: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
