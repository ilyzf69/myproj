import React from 'react';
import { MailIcon, LockClosedIcon } from '@heroicons/react/solid';
import Test from '../test/page'; // Assurez-vous que le chemin d'importation est correct

const InscriptionPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost/register.php', {
        method: 'POST',
        body: new FormData(e.currentTarget), // ou JSON.stringify pour les données JSON
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ou 'application/json' pour JSON
        },
      });

      const data = await response.json();
      console.log(data);
      // Gestion de la réponse ici, par exemple rediriger l'utilisateur ou afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-0">
        <div className="absolute inset-0 filter blur-lg">
          <Test />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen z-10">
        <div className="px-8 py-6 text-left bg-gray-800 text-white shadow-lg" style={{ zIndex: 20 }}>
          <h3 className="text-2xl font-bold text-center">Créer un compte</h3>
          <form >
            <div className="mt-4">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-gray-700">
                <MailIcon className="h-5 w-5 text-gray-300" />
                <input className="pl-2 outline-none border-none bg-transparent text-white" type="email" name="email" placeholder="Email" required />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl bg-gray-700">
                <LockClosedIcon className="h-5 w-5 text-gray-300" />
                <input
                  className="pl-2 outline-none border-none bg-transparent text-white"
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  required
                />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl mt-4 bg-gray-700">
                <LockClosedIcon className="h-5 w-5 text-gray-300" />
                <input
                  className="pl-2 outline-none border-none bg-transparent text-white"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmez le mot de passe"
                  required
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  className="px-6 py-2 leading-5 text-gray-900 transition-colors duration-200 transform bg-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                  type="submit"
                >
                  Inscription
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InscriptionPage;
