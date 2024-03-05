"use client"
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { useState } from 'react';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon, MusicNoteIcon, FireIcon, ThumbUpIcon } from '@heroicons/react/solid';




import React, { SVGProps } from 'react';


interface MoodIconProps {
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClick: () => void;
}

const MoodIcon: React.FC<MoodIconProps> = ({ icon: Icon, onClick }) => (
  <button onClick={onClick} className="w-10 h-10 text-purple-500 hover:text-purple-700">
    <Icon className="w-full h-full" />
  </button>
);

const emotions = [
  { icon: '❤️', name: 'Amour', query: 'love songs' },
  { icon: '😀', name: 'Joyeux', query: 'happy songs' },
  { icon: '😢', name: 'Triste', query: 'sad songs' },
  { icon: '⚡', name: 'Énergique', query: 'energetic songs' },
];

const MoodsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col items-center">
        <div className="flex justify-center mt-5">
        <div className="mt-10">
          <div className="flex justify-center mt-4 flex-wrap">
            {emotions.map(({ icon, name }) => (
              <button key={icon} onClick={() => handleEmotionSelect(icon)} className={`m-2 p-2 rounded ${selectedEmotion === icon ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {icon} {name}
              </button>
            ))}
          </div>
        </div>

        </div>



        <Link href="/hub">
          <p className="mt-10 p-4 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center">
            Retour au Hub
          </p>
        </Link>
      </div>
      <ChatPopup />
    </div>
  );
};

export default MoodsPage;
