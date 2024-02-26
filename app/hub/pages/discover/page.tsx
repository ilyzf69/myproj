"use client"
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import Graph from './Graph';
import { useState } from 'react';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon, MusicNoteIcon, FireIcon, ThumbUpIcon } from '@heroicons/react/outline';

const DiscoverPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const emotions = [
    { icon: '❤️', name: 'Amour' },
    { icon: '😀', name: 'Joyeux' },
    { icon: '😢', name: 'Triste' },
    { icon: '⚡', name: 'Énergique' },
    { icon: '🎵', name: 'Musical' },
    { icon: '🔥', name: 'Passionné' },
    { icon: '👍', name: 'Approuvé' }
  ];

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion === selectedEmotion ? null : emotion);
  };

  const topEmotions = emotions.slice(0, 4); // Les quatre premières émotions
  const bottomEmotions = emotions.slice(4); // Les trois dernières émotions

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-500">Découvrir</h1>
          <p className="mt-2 text-lg">Explorez de nouveaux contenus et tendances.</p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-green-500">Top Émotions</h2>
          <div className="flex justify-center mt-4 flex-wrap">
            {/* Afficher les quatre premières émotions */}
            {topEmotions.map(({ icon, name }) => (
              <button
                key={icon}
                onClick={() => handleEmotionSelect(icon)}
                className={`m-2 p-2 rounded flex items-center ${
                  selectedEmotion === icon ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span className={`ml-2 ${selectedEmotion === icon ? 'text-white' : 'text-gray-700'}`}>
                  {icon} {name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-center mt-4 flex-wrap">
            {/* Afficher les trois dernières émotions */}
            {bottomEmotions.map(({ icon, name }) => (
              <button
                key={icon}
                onClick={() => handleEmotionSelect(icon)}
                className={`m-2 p-2 rounded flex items-center ${
                  selectedEmotion === icon ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span className={`ml-2 ${selectedEmotion === icon ? 'text-white' : 'text-gray-700'}`}>
                  {icon} {name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Afficher le graphique uniquement si une émotion est sélectionnée */}
        {selectedEmotion && (
          <div className="mt-8">
            {/* Passer l'émotion sélectionnée au composant Graph */}
            <Graph emotion={selectedEmotion} />
          </div>
        )}

        <Link href="/hub">
          <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center">
            Retour au Hub
          </p>
        </Link>
      </div>
      <ChatPopup />
    </div>
  );
};

export default DiscoverPage;
