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

// Ta clé API YouTube
const YOUTUBE_API_KEY = 'TA_CLE_API_YOUTUBE';

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
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then(docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSelectedEmotion(data.mood);
            setRecentNotifications(data.recentNotifications || []);
            fetchRecommendations(data.mood); // Appel à la fonction de recommandation
          } else {
            console.log("No such document!");
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRecommendations = async (mood: string | null) => {
    if (!mood) return;

    let query = '';
    switch (mood) {
      case '❤️':
        query = 'chansons d\'amour';
        break;
      case '😀':
        query = 'musique joyeuse';
        break;
      case '😢':
        query = 'musique triste';
        break;
      case '⚡':
        query = 'musique énergique';
        break;
      default:
        query = 'musique populaire';
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=5`
      );
      const data = await response.json();
      const videoRecommendations = data.items.map((item: any) => `https://www.youtube.com/watch?v=${item.id.videoId}`);
      setRecommendations(videoRecommendations);
    } catch (error) {
      console.error('Error fetching YouTube recommendations:', error);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      alert("Merci pour votre feedback !");
      setFeedback(''); // Clear the textarea after submission
    } else {
      alert("Veuillez entrer un commentaire avant d'envoyer.");
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Sidebar */}
      <div className="w-full lg:w-64  text-white ">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 text-center">Votre Hub</h1>
          <ActivityFeed userMood={selectedEmotion || ''} />

          {/* Section des Recommandations musicales */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Recommandations basées sur votre humeur</h2>
            <ul>
              {recommendations.length > 0 ? recommendations.map((rec, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
                  <a href={rec} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {`Recommandation ${index + 1}`}
                  </a>
                </li>
              )) : (
                <p className="text-gray-600">Aucune recommandation disponible pour le moment.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Music bar at the bottom */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-gray-900">
        <MusicBar />
        <ChatPopup />
      </div>

      {/* Chat popup */}
      
    </div>
  );
};

export default Hub;
