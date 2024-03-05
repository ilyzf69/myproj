"use client";
import React, { useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon } from '@heroicons/react/solid';

const emotions = [
  { icon: HeartIcon, name: 'Amour', mood: 'love' },
  { icon: EmojiHappyIcon, name: 'Joyeux', mood: 'happy' },
  { icon: EmojiSadIcon, name: 'Triste', mood: 'sad' },
  { icon: LightningBoltIcon, name: 'Énergique', mood: 'energetic' },
];

const HumeurPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    // Ici, ajoutez la logique pour enregistrer l'humeur de l'utilisateur dans Firebase
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mt-10">Comment vous sentez-vous aujourd'hui ?</h1>
        <div className="flex justify-center mt-5 flex-wrap">
          {emotions.map(({ icon: Icon, name, mood }) => (
            <button
              key={mood}
              onClick={() => handleEmotionSelect(mood)}
              className={`m-2 p-2 rounded-lg flex flex-col items-center justify-center ${selectedEmotion === mood ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <Icon className="w-10 h-10 mb-1" />
              {name}
            </button>
          ))}
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

export default HumeurPage;
