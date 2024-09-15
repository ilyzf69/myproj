"use client";

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { MusicNoteIcon, EmojiHappyIcon, SearchIcon, HeartIcon, LogoutIcon, UserGroupIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { auth, db } from '../app/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import logoImage from '../image/logo.png';
import { MusicPlayerContext } from '../context/MusicPlayerContext';

export default function Sidebar() {
  const { currentTrack } = useContext(MusicPlayerContext);
  const [userMood, setUserMood] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar open/close

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  function Logo() {
    return <img src={logoImage.src} alt="Logo" className="h-20 w-20 rounded-full shadow-md" />;
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-700 via-gray-900 to-black text-white transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col justify-between h-full p-6">
          <div>
            <div className="mb-8 flex justify-between items-center">
              <Link href="/hub">
                <p className="cursor-pointer"><Logo /></p>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-gray-300">
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-6">
              <Link href="/hub/pages/discover">
                <p className="flex items-center gap-4 rounded-lg bg-gray-800 bg-opacity-30 px-6 py-3 transition-all hover:bg-opacity-50 cursor-pointer">
                  <SearchIcon className="h-6 w-6" />
                  Découvrir
                </p>
              </Link>
              <Link href="/hub/pages/moods">
                <p className="flex items-center gap-4 rounded-lg bg-gray-800 bg-opacity-30 px-6 py-3 transition-all hover:bg-opacity-50 cursor-pointer">
                  <EmojiHappyIcon className="h-6 w-6" />
                  Humeurs
                </p>
              </Link>
              <Link href="/hub/pages/favorites">
                <p className="flex items-center gap-4 rounded-lg bg-gray-800 bg-opacity-30 px-6 py-3 transition-all hover:bg-opacity-50 cursor-pointer">
                  <HeartIcon className="h-6 w-6" />
                  J'aime
                </p>
              </Link>
              <Link href="/hub/pages/playlists">
                <p className="flex items-center gap-4 rounded-lg bg-gray-800 bg-opacity-30 px-6 py-3 transition-all hover:bg-opacity-50 cursor-pointer">
                  <MusicNoteIcon className="h-6 w-6" />
                  Playlists
                </p>
              </Link>
              <Link href="/hub/pages/groupes">
                <p className="flex items-center gap-4 rounded-lg bg-gray-800 bg-opacity-30 px-6 py-3 transition-all hover:bg-opacity-50 cursor-pointer">
                  <UserGroupIcon className="h-6 w-6" />
                  Groupes
                </p>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 rounded-lg bg-red-700 bg-opacity-80 px-6 py-3 transition-all hover:bg-opacity-100 cursor-pointer"
              >
                <LogoutIcon className="h-6 w-6" />
                Déconnexion
              </button>
            </nav>
          </div>
          <div>
            {currentTrack && (
              <div className="mt-8 w-full bg-gray-800 bg-opacity-30 p-4 rounded-xl text-white shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">{currentTrack.title}</p>
                    <p className="text-sm text-gray-300">{currentTrack.artist}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-8 text-center text-white">
              <p>Votre humeur du jour :</p>
              <p className="text-lg font-semibold">{userMood}</p>
            </div>
          </div>
        </div>
      </div>

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
