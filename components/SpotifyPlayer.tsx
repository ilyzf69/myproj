// SpotifyPlayer.tsx
import React from 'react';

const SpotifyPlayer = ({ trackId }: { trackId: string }) => {
  const embedSrc = `https://open.spotify.com/embed/track/${trackId}`;
  return (
    <iframe
      src={embedSrc}
      width="100%"
      height="400px"
      frameBorder="0"
      allow="encrypted-media"
      allowTransparency
      allowFullScreen
    ></iframe>
  );
};

export default SpotifyPlayer;
