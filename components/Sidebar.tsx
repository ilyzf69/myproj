import React from 'react';
import Link from 'next/link';
import { MusicNoteIcon, EmojiHappyIcon, SearchIcon, HeartIcon, LogoutIcon } from '@heroicons/react/solid';
import Logo from '@/app/ui/test';
import { auth } from '../app/firebaseConfig';

export default function Sidebar() {
  
  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login"; // Redirigez l'utilisateur vers la page de connexion après la déconnexion
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 p-5 bg-gray-800 text-white">
      <div className="mb-10 flex justify-center">
        <Link href="/">
          <p><Logo/></p> 
        </Link>
      </div>

      <nav className="flex flex-col space-y-4">
        <Link href="/discover">
          <p className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            <SearchIcon className="h-6 w-6" />
            <span>Découvrir</span>
          </p>
        </Link>
        <Link href="/moods">
          <p className="flex items-center gap-3 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
            <EmojiHappyIcon className="h-6 w-6" />
            <span>Humeurs</span>
          </p>
        </Link>
        <Link href="/favorites">
          <p className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
            <HeartIcon className="h-6 w-6" />
            <span>Favoris</span>
          </p>
        </Link>
        <Link href="/playlists">
          <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
            <MusicNoteIcon className="h-6 w-6" />
            <span>Playlists</span>
          </p>
        </Link>
        <div className="mt-auto"> 
        <Link href="#" onClick={handleLogout}>
          <p className="flex items-center gap-3 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700">
            <LogoutIcon className="h-6 w-6" />
            <span>Déconnexion</span>
          </p>
        </Link>
      </div>
      </nav>

    
    </div>
  );
}