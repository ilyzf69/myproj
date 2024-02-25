import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import ChatPopup from '../../../../components/Chat';

const MoodsPage: React.FC = () => {
    return (
        <div className="flex h-screen">
          <Sidebar />
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Humeurs</h1>
              <p className="mt-2 text-lg">Sélectionnez la musique qui correspond à votre humeur.</p>
            </div>
            <Link href="/hub">
              <p className="mt-10 p-4 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center">
                Retour au Hub
              </p>
            </Link>
            
          </div>
          <ChatPopup/>
        </div>
      );
};

export default MoodsPage;
