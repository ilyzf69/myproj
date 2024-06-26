import React from 'react';

type YouTubePlayerProps = {
  videoId: string;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  
  return (
    <div className="video-container">
      <iframe
        width="100%"
        height="400px"
        src={videoSrc}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Video Player"
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;
