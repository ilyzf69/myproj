"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import ActivityFeed from '../../../../components/ActivityFeed';
import ChatPopup from '../../../../components/Chat';
import { auth, db } from '../../../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { EmojiHappyIcon, EmojiSadIcon, HeartIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { onAuthStateChanged } from 'firebase/auth';
import HappyVideo from '../../../videos/HappyVideo';
import SadVideo from '../../../videos/SadVideo';
import LoveVideo from '../../../videos/LoveVideo';
import EnergeticVideo from '../../../videos/EnergeticVideo';

const emotions = [
  { icon: HeartIcon, name: 'Amour', mood: '❤️', video: LoveVideo },
  { icon: EmojiHappyIcon, name: 'Joyeux', mood: '😀', video: HappyVideo },
  { icon: EmojiSadIcon, name: 'Triste', mood: '😢', video: SadVideo },
  { icon: LightningBoltIcon, name: 'Énergique', mood: '⚡', video: EnergeticVideo },
];

const Hub = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then(docSnap => {
          if (docSnap.exists()) {
            setSelectedEmotion(docSnap.data().mood);
          } else {
            console.log("No such document!");
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const BackgroundVideoComponent = emotions.find(e => e.mood === selectedEmotion)?.video;

  return (
    <div className="relative flex h-screen flex-col">
      <div className="absolute inset-0 z-0">
        {BackgroundVideoComponent && <BackgroundVideoComponent />}
      </div>
      <div className="relative z-10 w-full h-full flex-1 flex">
        <div className="fixed inset-y-0 left-0 z-20 w-64">
          <Sidebar />
        </div>
        <main className="p-4 lg:p-8 flex-1">
          <div className="flex justify-center items-center flex-col">
            <ActivityFeed />
          </div>
        </main>
        <ChatPopup />
        
      </div>
     
      
       
    </div>
  );
};

export default Hub;
