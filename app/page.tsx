import React from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CampaignCard from '../components/CampaignCard';
import ActivityFeed from '../components/ActivityFeed';

const Page = () => {
  // The hub content is shown based on the presence of a query parameter in the URL.

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            BIENVENUE
          </h1>
          <Link href="/hub" shallow>
            <p className="inline-block mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
              Explorer le hub
            </p>
          </Link>
        </div>
        {/* Below is the conditional rendering based on the query parameter */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('showHub') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <ActivityFeed />
            </section>
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <CampaignCard />
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
