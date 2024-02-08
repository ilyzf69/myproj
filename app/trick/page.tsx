import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';


export default function ActivityFeed() {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex">
        <div className="fixed inset-y-0 left-0 z-20">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64"> {/* ml-64 pour compenser la largeur de la sidebar */}
          <Header />
          <main className="p-4 lg:p-8">
          <div className="bg-gray-700 p-4 my-4 rounded-lg shadow-lg">
          {/* Flux d'activité avec vidéo intégrée */}
          <div className="video-responsive">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/npBrRs6J0Jc"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
          </main>
        </div>
      </div>
    );
  }
