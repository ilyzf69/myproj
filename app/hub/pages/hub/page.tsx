"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import ActivityFeed from '../../../../components/ActivityFeed';
import ChatPopup from '../../../../components/Chat';
import { auth, db } from '../../../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { EmojiHappyIcon, EmojiSadIcon, HeartIcon, LightningBoltIcon } from '@heroicons/react/solid';
import { onAuthStateChanged } from 'firebase/auth';
import MusicBar from '../../../../components/MusicBar';

const emotions = [
  { icon: HeartIcon, name: 'Amour', mood: '❤️' },
  { icon: EmojiHappyIcon, name: 'Joyeux', mood: '😀' },
  { icon: EmojiSadIcon, name: 'Triste', mood: '😢' },
  { icon: LightningBoltIcon, name: 'Énergique', mood: '⚡' },
];

const Hub: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then(docSnap => {
          if (docSnap.exists()) {
            setSelectedEmotion(docSnap.data().mood);
            setRecentNotifications(docSnap.data().recentNotifications || []);
            fetchRecommendations(docSnap.data().mood);
          } else {
            console.log("No such document!");
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRecommendations = (mood: string | null) => {
    // Logic to fetch recommendations based on mood.
    if (mood) {
      setRecommendations([
        "Recommandation 1",
        "Recommandation 2",
        "Recommandation 3",
      ]);
    }
  };

  const handleFeedbackSubmit = () => {
    // Logic to handle feedback submission
    alert("Merci pour votre feedback !");
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-5xl font-extrabold text-white mb-8">Votre Hub</h1>
          <ActivityFeed userMood={selectedEmotion || ''} />

          {/* Section des Recommandations musicales */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommandations basées sur votre humeur</h2>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Section des Notifications récentes */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications récentes</h2>
            <ul>
              {recentNotifications.length > 0 ? recentNotifications.map((notification, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
                  {notification}
                </li>
              )) : (
                <p className="text-gray-600">Aucune nouvelle notification.</p>
              )}
            </ul>
          </div>

          {/* Section de Feedback */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre avis nous intéresse</h2>
            <textarea
              className="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              rows={3}
              placeholder="Laissez vos commentaires ici..."
            />
            <button
              onClick={handleFeedbackSubmit}
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>

      {/* Music bar at the bottom */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-gray-900">
        <MusicBar />
      </div>

      {/* Chat popup */}
      <ChatPopup />
    </div>
  );
};

export default Hub;
