"use client";
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { MusicNoteIcon, EmojiHappyIcon, SearchIcon, HeartIcon, LogoutIcon, UserGroupIcon } from '@heroicons/react/solid';
import { auth, db } from '../app/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import logoImage from '../image/logo.png';
import { MusicPlayerContext } from '../context/MusicPlayerContext';

export default function Sidebar() {
  const { currentTrack } = useContext(MusicPlayerContext);
  const [userMood, setUserMood] = useState('');

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
    return <img src={logoImage.src} alt="Logo" className="h-12 w-12" />;
  }

  return (
    <div className="flex flex-col justify-between h-full bg-black text-white p-5 rounded-xl shadow-lg">
      <div>
        <div className="mb-10 flex justify-center">
          <Link href="/hub">
            <p><Logo /></p>
          </Link>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link href="/hub/pages/discover">
            <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700">
              <SearchIcon className="h-6 w-6" />
              Découvrir
            </p>
          </Link>
          <Link href="/hub/pages/moods">
            <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700">
              <EmojiHappyIcon className="h-6 w-6" />
              Humeurs
            </p>
          </Link>
          <Link href="/hub/pages/favorites">
            <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700">
              <HeartIcon className="h-6 w-6" />
              J'aime
            </p>
          </Link>
          <Link href="/hub/pages/playlists">
            <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700">
              <MusicNoteIcon className="h-6 w-6" />
              Playlists
            </p>
          </Link>
          <Link href="/hub/pages/groupes">
            <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700">
              <UserGroupIcon className="h-6 w-6" />
              Groupes
            </p>
          </Link>
          <Link href="/hub/pages/groupes">
            <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700">
              <LogoutIcon className="h-6 w-6" />
              Déconnexion
            </p>
          </Link>
        </nav>
      </div>
      <div>
        
        {currentTrack && (
          <div className="mt-4 w-full bg-gray-700 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{currentTrack.title}</p>
                <p className="text-xs">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 text-center text-white">
          <p>Votre humeur du jour :</p>
          {userMood}
        </div>
      </div>
    </div>
  );
}
