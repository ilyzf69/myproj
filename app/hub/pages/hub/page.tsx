"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import ActivityFeed from "../../../../components/ActivityFeed";
import ChatPopup from "../../../../components/Chat";
import { auth, db } from "../../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import {
  EmojiHappyIcon,
  EmojiSadIcon,
  HeartIcon,
  LightningBoltIcon,
  PlayIcon,
} from "@heroicons/react/solid";
import { onAuthStateChanged } from "firebase/auth";
import MusicBar from "../../../../components/MusicBar";

// Utilisation de la clé API YouTube depuis le fichier .env
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const emotions = [
  { icon: HeartIcon, name: "Amour", mood: "❤️" },
  { icon: EmojiHappyIcon, name: "Joyeux", mood: "😀" },
  { icon: EmojiSadIcon, name: "Triste", mood: "😢" },
  { icon: LightningBoltIcon, name: "Énergique", mood: "⚡" },
];

const Hub: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<
    { title: string; url: string; thumbnailUrl: string }[]
  >([]);
  const [feedback, setFeedback] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSelectedEmotion(data.mood);
            setRecentNotifications(data.recentNotifications || []);
            fetchRecommendations(data.mood); // Appel à la fonction de recommandation
          } else {
            console.log("Aucun document trouvé !");
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRecommendations = async (mood: string | null) => {
    if (!mood) return;

    let query = "";
    switch (mood) {
      case "❤️":
        query = "chansons d'amour";
        break;
      case "😀":
        query = "musique joyeuse";
        break;
      case "😢":
        query = "musique triste";
        break;
      case "⚡":
        query = "musique énergique";
        break;
      default:
        query = "musique populaire";
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}&maxResults=5`
      );
      const data = await response.json();
      const videoRecommendations = data.items.map((item: any) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnailUrl: item.snippet.thumbnails.medium.url, // Ajout de la miniature
      }));
      setRecommendations(videoRecommendations);
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations YouTube :", error);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      alert("Merci pour votre feedback !");
      setFeedback(""); // Clear the textarea after submission
    } else {
      alert("Veuillez entrer un commentaire avant d'envoyer.");
    }
  };

  // Fonction pour gérer le partage d'une musique
  const shareTrack = (track: string) => {
    setSelectedTrack(track);
    setShowShareDialog(true);
  };

  const shareOutsideApp = async () => {
    try {
      if (selectedTrack) {
        const shareData = {
          title: "Découvrez cette musique",
          text: "Écoutez cette musique incroyable sur YouTube",
          url: selectedTrack,
        };
        await navigator.share(shareData);
        setShowShareDialog(false); // Fermer le dialogue après le partage
      }
    } catch (error) {
      console.error("Erreur lors du partage :", error);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      {/* Sidebar */}
      

      {/* Main content area */}
      <div className="relative z-10 flex-1 p-4 lg:p-8 overflow-y-auto">
      <div className="w-full lg:w-64 text-white">
        <Sidebar />
      </div>
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 text-center">
            Votre Hub
          </h1>
          <ActivityFeed userMood={selectedEmotion || ""} />

          {/* Section des Recommandations musicales */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Recommandations basées sur votre humeur
            </h2>
            <ul>
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center space-x-4 shadow-md"
                  >
                    <img
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="flex-grow">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold text-lg"
                      >
                        {rec.title}
                      </a>
                      <p className="text-gray-500">Unknown Artist</p>
                    </div>
                    <button
                      onClick={() => shareTrack(rec.url)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Partager
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">
                  Aucune recommandation disponible pour le moment.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Music bar at the bottom */}
      <div className="fixed bottom-0 left-0 w-full z-20 ">
        <MusicBar />
        <ChatPopup />
      </div>

      {/* Dialogue de partage */}
      {showShareDialog && selectedTrack && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="mb-4">Partager cette musique</h3>
            <p className="text-gray-700 mb-4">
              Voulez-vous partager cette musique à l extérieur de l application ?
            </p>
            <button
              onClick={shareOutsideApp}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
            >
              Partager à l extérieur de l application
            </button>
            <button
              onClick={() => setShowShareDialog(false)}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 w-full mt-2"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hub;
