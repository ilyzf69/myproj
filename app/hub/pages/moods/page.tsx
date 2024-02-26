"use client"
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { useState } from 'react';
import Moods from './moods';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon, MusicNoteIcon, FireIcon, ThumbUpIcon } from '@heroicons/react/solid';
import { Emotion } from './moods';



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
        <MoodIcon icon={HeartIcon} onClick={() => handleEmotionSelect('❤️')} />
<MoodIcon icon={EmojiHappyIcon} onClick={() => handleEmotionSelect('😀')} />
<MoodIcon icon={EmojiSadIcon} onClick={() => handleEmotionSelect('😢')} />
<MoodIcon icon={LightningBoltIcon} onClick={() => handleEmotionSelect('⚡')} />
<MoodIcon icon={MusicNoteIcon} onClick={() => handleEmotionSelect('🎵')} />
<MoodIcon icon={FireIcon} onClick={() => handleEmotionSelect('🔥')} />
<MoodIcon icon={ThumbUpIcon} onClick={() => handleEmotionSelect('👍')} />

        </div>

        {selectedEmotion && <Moods emotion={selectedEmotion as Emotion} />}


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
