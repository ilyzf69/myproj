import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import WelcomeBanner from '../../components/WelcomeBanner';



import React from 'react';


const Page = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Sidebar/>
      <div className="main-content">
        <Header/>
        <WelcomeBanner/>
        <div className="content">
          
          
        </div>
      </div>
    </div>
  );
};

export default Page;

