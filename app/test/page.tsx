"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';
import MusicBar from '@/components/MusicBar';
import ActivityFeed from '@/components/ActivityFeed';

const Page = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-blue-500 opacity-75"></div>
      </div>
      <div className="relative z-10 flex flex-col bg-white bg-opacity-50 rounded-xl shadow-lg w-4/5 h-4/5">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
              Activity Feed
            </h1>
            <ActivityFeed />
          </main>
        </div>
        <MusicBar />
      </div>
    </div>
  );
};

export default Page;
