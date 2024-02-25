// LoginForm.tsx





// LoginForm.tsx

'use client';
import Test from '../test/page';
import React, { useState } from 'react';


import { MailIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/solid';

// Assurez-vous d'avoir initialisé Firebase ailleurs dans votre application
// Importez la fonction de connexion depuis Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Mettez à jour avec le chemin vers votre configuration Firebase

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(''); // Réinitialiser l'erreur à chaque soumission
    try {
        await signInWithEmailAndPassword(auth, email, password);
        setShowConfirmation(true);
        setTimeout(() => {
          window.location.href = "/hub";
        }, 3000);
      } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Afficher le message d'erreur de Firebase
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    }
  };

  return (
    <>
    

    {showConfirmation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-50">
        <div className="m-auto bg-white p-5 rounded-lg flex flex-col items-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
          <h3 className="mt-2 text-lg font-semibold">Connexion réussie!</h3>
          <p>Redirection vers le hub...</p>
        </div>
      </div>
    )}


<div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-0">
      <div className="absolute inset-0 filter blur-lg">
        <Test />
      </div>
    </div>

    <div className="flex items-center justify-center min-h-screen z-10">
      <div className="px-8 py-6 text-left bg-gray-800 text-white shadow-lg" style={{ zIndex: 20 }}>
        <h3 className="text-2xl font-bold text-center">Se connecter</h3>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block" htmlFor="email">
              <MailIcon className="h-5 w-5 text-gray-300" />
              <input
                className="form-input mt-1 block w-full pl-10"
                type="email"
                name="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block mt-4" htmlFor="password">
              <LockClosedIcon className="h-5 w-5 text-gray-300" />
              <input
                className="form-input mt-1 block w-full pl-10"
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className="flex items-center justify-between mt-4">
              <button
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none rounded"
                type="submit"
              >
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

export default LoginForm;


