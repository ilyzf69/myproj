
import React from 'react';
import Sidebar from '../../components/Sidebar';
import ActivityFeed from '../../components/ActivityFeed';

const Page = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <div className="fixed inset-y-0 left-0 z-20 w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 ml-64">
        <main className="p-4 lg:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            
            <ActivityFeed />

            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;