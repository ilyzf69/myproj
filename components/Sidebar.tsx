import React from 'react';
import Link from 'next/link';
import { MusicNoteIcon, EmojiHappyIcon, SearchIcon, HeartIcon, LogoutIcon, ChatAlt2Icon } from '@heroicons/react/solid';
import { auth } from '../app/firebaseConfig';
import logoImage from '../image/test.png';



export default function Sidebar() {



  function Logo() {
    return (
      <img src={logoImage.src} alt="Logo" className="h-12 w-12" />
    );
  }




  
  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/"; // Redirigez l'utilisateur vers la page de connexion après la déconnexion

    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  };

  return (
    <div className="fixed rounded-xl shadow-lg inset-y-0 left-0 p-5 bg-gray-500 text-white">


      <div className="mb-10 flex justify-center">

        <Link href="/hub">
          <p><Logo/></p> {/* Assurez-vous que le logo est bien centré et visible */}

        </Link>
      </div>

      <nav className="flex flex-col space-y-4">

      <Link href="/hub/pages/discover" className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700" >
      <SearchIcon className="h-6 w-6" />
          <span>Découvrir</span>
        </Link>
      
        <Link href="/hub/pages/moods" className="flex items-center gap-3 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
        
          <EmojiHappyIcon className="h-6 w-6" />
          <span>Humeurs</span>
        </Link>

        <Link href="/hub/pages/favorites" className="flex items-center gap-3 rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700">
   
          <HeartIcon className="h-6 w-6" />
          <span>Favoris</span>
      
        </Link>
        
        <Link href="/hub/pages/playlists" className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">

          <MusicNoteIcon className="h-6 w-6" />
          <span>Playlists</span>

        </Link>
        <div className="mt-auto"> {/* Met le bouton de déconnexion tout en bas */}
        <Link href="/"  className="mt-auto flex items-center gap-3 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700">
          <LogoutIcon className="h-6 w-6" />
          <span>Déconnexion</span>
     

        </Link>
      </div>
      </nav>


      {/* Bouton de déconnexion avec LogoutIcon */}

    </div>
  );
}