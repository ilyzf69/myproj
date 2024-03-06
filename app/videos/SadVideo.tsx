import React from 'react';

const SadVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover " autoPlay loop muted>
        <source src="/videos/sad.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default SadVideo;
