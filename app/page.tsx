"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import ActivityFeed from '@/components/ActivityFeed';
import CampaignCard from '@/components/CampaignCard';

const Page = () => {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-blue-500 opacity-75"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-black bg-opacity-50 rounded-xl shadow-lg">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          BIENVENUE sur FEELS IA
        </h1>
        <div className="mt-8 flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            type="button"
            onClick={() => router.push('/login')}
          >
            Connectez-vous !
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            type="button"
            onClick={() => router.push('/register')}
          >
            Créer un compte !
          </button>
        </div>

        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('showHub') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-screen-lg mx-auto">
            <section className="bg-gray-800 p-8 rounded-xl shadow-lg">
              <ActivityFeed userMood={''} />
            </section>
            <section className="bg-gray-800 p-8 rounded-xl shadow-lg">
              <CampaignCard />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
