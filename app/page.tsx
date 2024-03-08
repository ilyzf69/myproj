"use client"
import React from 'react';
import CampaignCard from '../components/CampaignCard';
import ActivityFeed from '../components/ActivityFeed';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-0">
        <iframe
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'blur(8px)' }}
          src="https://www.youtube.com/embed/lR9a4fgegi4?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=lR9a4fgegi4&mute=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video Background"
        ></iframe>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="bg-gray-900 text-white min-h-screen flex flex-col z-10">
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center bg-black bg-opacity-20 z-20 rounded-xl p-8">
            <h1 className="text-4xl md:text-6xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              BIENVENUE sur FEELS IA
            </h1>
            <button
              className="inline-block mt-4 md:mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-xl md:text-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              type="button"
              onClick={() => router.push('/login')}
            >
              Connectez-vous !
            </button>
            <button
              className="inline-block mt-4 md:mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl md:text-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              type="button"
              onClick={() => router.push('/register')}
            >
              Créer un compte !
            </button>
          </div>

          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('showHub') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-screen-lg mx-auto">
              <section className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <ActivityFeed />
              </section>
              <section className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <CampaignCard />
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Page;
