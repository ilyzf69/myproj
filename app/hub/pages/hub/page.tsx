import React from 'react';
import Sidebar from '../../../../components/Sidebar';
import ActivityFeed from '../../../../components/ActivityFeed';
import ChatPopup from '../../../../components/Chat';

const Hub = () => {
  return (
    <div className="flex h-screen bg-white">
  <div className="fixed inset-y-0 left-0 z-20 w-64  shadow-md">
    <Sidebar />
  </div>
  <div className="flex-1 flex flex-col m-auto bg-gray-900 rounded-xl shadow-lg max-w-6xl">
    <main className="p-4 lg:p-8 flex-1">
      <div className="flex justify-center items-center flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <ActivityFeed />
        </div>
      </div>
    </main>
  </div>
  <ChatPopup/>
</div>


  );
};

export default Hub;
