import Sidebar from '../../../../components/Sidebar'; // Ajustez le chemin selon la structure de votre projet
import Link from 'next/link';

const PlaylistsPage: React.FC = () => {
    return (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Contenu principal de la page Playlists */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">Mes Playlists</h1>
              <p className="mt-2 text-lg">Explorez et gérez vos playlists ici.</p>
            </div>

            {/* Bulle de redirection vers le hub */}
            <Link href="/hub">
              <p className="mt-10 p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center">
                <span>Retour au Hub</span>
              </p>
            </Link>
          </div>
        </div>
      );
};

export default PlaylistsPage;
