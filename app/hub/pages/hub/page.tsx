import React from 'react';
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header';
import ActivityFeed from '../../../../components/ActivityFeed';

const Hub = () => {
  return (
    <div className="flex h-screen bg-white">
  <div className="fixed inset-y-0 left-0 z-20 w-64  shadow-md">
    <Sidebar />
  </div>
  <div className="flex-1 flex flex-col m-auto bg-gray-900 rounded-xl shadow-lg max-w-6xl">
  <Header />
    <main className="p-4 lg:p-8 flex-1">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-2xl font-bold mb-4 text-white">Bienvenue sur le Hub</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <ActivityFeed />
          <ActivityFeed />
          <ActivityFeed />
          <ActivityFeed />
          <ActivityFeed />
          <ActivityFeed />
          
        </div>
      </div>
    </main>
  </div>
</div>


  );
};

export default Hub;
