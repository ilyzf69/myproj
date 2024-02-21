// Fichier : login/page.tsx
import React from 'react';
import { MailIcon, LockClosedIcon } from '@heroicons/react/solid';
import Test from '../test/page'; // Assurez-vous que le chemin est correct
import { UNSTABLE_REVALIDATE_RENAME_ERROR } from 'next/dist/lib/constants';

const LoginPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher la soumission classique du formulaire

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');
  
    try {
      const response = await fetch('http://localhost/login.php', {
        method: 'POST',
        body: JSON.stringify({
          password: password,
          username: username,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Connexion réussie');
        // Vous pouvez ajouter ici une logique pour gérer la connexion réussie,
        // par exemple en sauvegardant le jeton d'accès et en redirigeant l'utilisateur.
      } else {
        alert('Échec de la connexion');
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      alert('Une erreur s\'est produite lors de la connexion');
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
          <h3 className="text-2xl font-bold text-center">Se connecter</h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-gray-700">
                <MailIcon className="h-5 w-5 text-gray-300" />
                <input className="pl-2 outline-none border-none bg-transparent text-white" type='username' name="username" placeholder="Nom d'utilisateur" required />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl bg-gray-700">
                <LockClosedIcon className="h-5 w-5 text-gray-300" />
                <input className="pl-2 outline-none border-none bg-transparent text-white" type="password" name="password" placeholder="Mot de passe" required />
              </div>
              <div className="flex items-center justify-between mt-4">
                <button className="px-6 py-2 leading-5 text-gray-900 transition-colors duration-200 transform bg-white rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300" type="submit">
                  Connexion
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
