"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import { db, auth } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useMusicPlayer } from "../../../../context/MusicPlayerContext"; // Import du contexte de musique
import { HeartIcon } from "@heroicons/react/solid";
import logoYT from "../../../../image/youtube.png"; // Logo YouTube
import logoSP from "../../../../image/spotify.png"; // Logo Spotify
import { onAuthStateChanged } from "firebase/auth";
import MusicBar from "../../../../components/MusicBar"; 

type Music = {
  videoId: string;
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  source: string;
  url: string;
};

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Music[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Music[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState<string>("all");
  const { setCurrentTrack, setIsPlaying, setTitleMusic, setThumbnailUrl } = useMusicPlayer(); // Utilisation du contexte de musique
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchFavorites(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [favorites, filter]);

  const fetchFavorites = async (userId: string) => {
    const favoritesCollection = collection(db, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesCollection);
    const fetchedFavorites = favoritesSnapshot.docs.map((doc) => doc.data() as Music);
    setFavorites(fetchedFavorites);
  };

  const applyFilter = () => {
    if (filter === "all") {
      setFilteredFavorites(favorites);
    } else {
      setFilteredFavorites(favorites.filter((music) => music.source === filter));
    }
  };

  const handlePlay = (music: Music) => {
    setCurrentTrack(music); // Définit la musique actuelle dans la barre de musique
    setIsPlaying(true); // Démarre la lecture
    setTitleMusic(music.title); // Définit le titre de la musique
    setThumbnailUrl(music.thumbnailUrl); // Définit la miniature de la musique

    // Enregistrer les informations dans le localStorage pour persister la musique
    localStorage.setItem("currentTrack", JSON.stringify(music));
  };

  const loadMoreTracks = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 overflow-hidden">
      {/* Barre latérale */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        <h1 className="text-5xl font-extrabold text-white mb-8">Mes Favoris</h1>
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-lg font-semibold ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter("youtube")}
            className={`px-4 py-2 rounded-full text-lg font-semibold ${filter === "youtube" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            YouTube
          </button>
          <button
            onClick={() => setFilter("spotify")}
            className={`px-4 py-2 rounded-full text-lg font-semibold ${filter === "spotify" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            Spotify
          </button>
        </div>

        <div className="track-list mt-8 w-full flex-1 flex flex-col items-center p-10">
          {filteredFavorites.slice(0, visibleCount).map((music) => (
            <div key={music.id} className="track-item mb-6 flex items-center bg-white shadow-md p-6 rounded-lg text-black w-full max-w-4xl">
              <HeartIcon className="h-8 w-8 cursor-pointer text-red-500" />
              <img src={music.thumbnailUrl} alt={music.title} className="inline-block mr-4 rounded" style={{ width: "80px", height: "80px" }} />
              <div className="flex-1">
                <p className="font-semibold text-lg song-title">{music.title}</p>
                <p className="text-gray-500 text-sm">{music.artist}</p>
              </div>
              {music.source === "youtube" && <img src={logoYT.src} alt="YouTube" className="h-10 w-10 mr-4" />}
              {music.source === "spotify" && <img src={logoSP.src} alt="Spotify" className="h-10 w-10 mr-4" />}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => handlePlay(music)} // Joue la musique lorsque le bouton est cliqué
              >
                Écouter
              </button>
            </div>
          ))}
          {visibleCount < filteredFavorites.length && (
            <button
              onClick={loadMoreTracks}
              className="mt-10 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Voir Plus
            </button>
          )}
        </div>
      </div>

      {/* Barre de musique */}
      <div className="fixed bottom-0 left-0 w-full z-30">
        <MusicBar />
      </div>
    </div>
  );
};

export default FavoritesPage;
