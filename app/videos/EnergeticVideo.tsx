import React from 'react';

const EnergeticVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover " autoPlay loop muted>
        <source src="/videos/energetic.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default EnergeticVideo;
