import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import ActivityFeed from '../../../../components/ActivityFeed';
import ChatPopup from '../../../../components/Chat';
import { auth, db } from '../../../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const Hub = () => {
  const [userMood, setUserMood] = useState('');
  const [backgroundVideo, setBackgroundVideo] = useState('');

  useEffect(() => {
    const fetchUserMood = async () => {
      const user = auth.currentUser;
      if (user) {
        // Ici vous pouvez récupérer l'humeur de l'utilisateur depuis votre base de données ou toute autre source de données
        // Par exemple, si vous avez une collection "users" avec un champ "mood", vous pouvez le récupérer comme suit :
        const userSnapshot = await getDoc(doc(db, 'users', user.uid));
        // setUserMood(userSnapshot.data().mood);
        
        // Pour l'exemple, je vais simuler différentes humeurs
        const randomMoods = ['happy', 'sad', 'love', 'energetic'];
        const randomIndex = Math.floor(Math.random() * randomMoods.length);
        setUserMood(randomMoods[randomIndex]);
      }
    };

    fetchUserMood();
  }, []);

  useEffect(() => {
    const getBackgroundVideo = () => {
      switch (userMood) {
        case 'happy':
          return '/happy_background.mp4';
        case 'sad':
          return '/sad.mp4';
        case 'love':
          return '/love_background.mp4';
        case 'energetic':
          return '/energetic_background.mp4';
        default:
          return '/default_background.mp4';
      }
    };

    setBackgroundVideo(getBackgroundVideo());
  }, [userMood]);

  return (
    <div className="relative flex h-screen">
      <video className="absolute inset-0 object-cover w-full h-full" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="fixed inset-y-0 left-0 z-20 w-64 shadow-md">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col m-auto bg-gray-900 rounded-xl shadow-lg max-w-6xl">
        <main className="p-4 lg:p-8 flex-1">
          <div className="flex justify-center items-center flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>
      <ChatPopup />
    </div>
  );
};

export default Hub;
