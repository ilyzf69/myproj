"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';
import { HeartIcon, EmojiHappyIcon, EmojiSadIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { db, auth } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import MusicBar from '../../../../components/MusicBar';  // Import de la barre de musique

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
    <div className="relative flex h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="absolute inset-0 z-10 flex flex-col w-full">
        <Sidebar />
        
        {/* Utilisation de justify-center et items-center pour centrer le contenu verticalement et horizontalement */}
        <div className="flex-1 flex flex-col justify-center items-center p-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">
            Comment vous sentez-vous aujourdhui ?
          </h1>
          <div className="flex justify-center mt-5 flex-wrap">
            {emotions.map(({ icon: Icon, name, mood }) => (
              <button
                key={mood}
                onClick={() => handleEmotionSelect(mood)}
                className={`m-2 p-4 rounded-full flex flex-col items-center justify-center transition duration-300 ease-in-out ${
                  selectedEmotion === mood
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Icon className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold truncated-text">{name}</span>
              </button>
            ))}
          </div>
          <Link href="/hub">
            <p className="mt-10 p-4 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer">
              Retour au Hub
            </p>
          </Link>
        </div>
        <ChatPopup />
      </div>

      {/* MusicBar fixée en bas de la page */}
      <div className="fixed bottom-0 left-0 w-full z-30">
        <MusicBar />
      </div>
    </div>
  );
};

export default HumeurPage;
