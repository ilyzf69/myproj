import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { MusicNoteIcon, EmojiHappyIcon, SearchIcon, HeartIcon, LogoutIcon, PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { auth, db } from '../app/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import logoImage from '../image/logo.png';
import { MusicPlayerContext } from '../context/MusicPlayerContext';

export default function Sidebar() {
  const { currentTrack, isPlaying, togglePlayPause } = useContext(MusicPlayerContext);
  const [userMood, setUserMood] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserMood(docSnap.data().mood || 'Non spécifié');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  function Logo() {
    return <img src={logoImage.src} alt="Logo" className="h-12 w-12" />;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`fixed rounded-xl shadow-lg inset-y-0 ${isSidebarOpen ? 'left-0' : '-left-56'} p-5 bg-white text-white flex flex-col justify-between transition-all duration-300`}>
      <div>
        <div className="mb-10 flex justify-center">
          <Link href="/hub">
            <p><Logo/></p>
          </Link>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link href="/hub/pages/discover" className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
            <SearchIcon className="h-6 w-6" />
            <span>Découvrir</span>
          </Link>
          <Link href="/hub/pages/moods" className="flex items-center gap-3 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
            <EmojiHappyIcon className="h-6 w-6" />
            <span>Humeurs</span>
          </Link>
          <Link href="/hub/pages/favorites" className="flex items-center gap-3 rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700">
            <HeartIcon className="h-6 w-6" />
            <span>Likes</span>
          </Link>
          <Link href="/hub/pages/playlists" className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
            <MusicNoteIcon className="h-6 w-6" />
            <span>Playlists</span>
          </Link>
          <button className="mt-auto flex items-center gap-3 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700" onClick={handleLogout}>
        <LogoutIcon className="h-6 w-6" />
        <span>Déconnexion</span>
      </button>
        </nav>
      </div>
      {currentTrack && (
        <div className="self-center w-full bg-gray-700 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{currentTrack.title}</p>
              <p className="text-xs">{currentTrack.artist}</p>
            </div>
            <button onClick={togglePlayPause}>
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 text-center text-black">
        Votre humeur du jour<br/>
        {userMood}
      </div>
      <div className="mt-4 text-center text-black">
      </div>
      
      <button className="fixed bottom-4 left-4 bg-gray-600 p-2 rounded-full text-white hover:bg-gray-700" onClick={toggleSidebar}>
        {isSidebarOpen ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
      </button>
    </div>
  );
}
