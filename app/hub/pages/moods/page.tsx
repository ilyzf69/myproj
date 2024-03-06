"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { db, auth } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const emotions = [
  { icon: HeartIcon, name: 'Amour', mood: '❤️' },
  { icon: EmojiHappyIcon, name: 'Joyeux', mood: '😀' },
  { icon: EmojiSadIcon, name: 'Triste', mood: '😢' },
  { icon: LightningBoltIcon, name: 'Énergique', mood: '⚡' },
];

const HumeurPage: React.FC = () => {
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

  const handleEmotionSelect = async (mood: string) => {
    setSelectedEmotion(mood);

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { mood }, { merge: true });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mt-10">Comment vous sentez-vous aujourdhui ?</h1>
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
