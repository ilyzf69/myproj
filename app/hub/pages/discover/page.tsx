import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';

const DiscoverPage: React.FC = () => {
    return (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Découvrir</h1>
              <p className="mt-2 text-lg">Explorez de nouveaux contenus et tendances.</p>
            </div>
            <Link href="/hub">
              <p className="mt-10 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center">
                Retour au Hub
              </p>
            </Link>
          </div>
        </div>
      );
};

export default DiscoverPage;
