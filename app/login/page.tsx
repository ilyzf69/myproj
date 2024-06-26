"use client";
import React, { useState } from 'react';
import { MailIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

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
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Afficher le message d'erreur de Firebase
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-center">Se connecter</h3>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block relative" htmlFor="email">
              <MailIcon className="h-5 w-5 text-gray-300 absolute left-3 top-3" />
              <input
                className="form-input mt-1 block w-full pl-10 pr-4 py-2 bg-gray-700 border-none rounded-md"
                type="email"
                name="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block mt-4 relative" htmlFor="password">
              <LockClosedIcon className="h-5 w-5 text-gray-300 absolute left-3 top-3" />
              <input
                className="form-input mt-1 block w-full pl-10 pr-4 py-2 bg-gray-700 border-none rounded-md"
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
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                type="submit"
              >
                Connexion
              </button>
            </div>
          </div>
        </form>
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-50 flex items-center justify-center">
            <div className="m-auto bg-white p-5 rounded-lg flex flex-col items-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 " />
              <h3 className="mt-2 text-lg font-semibold text-black">Connexion réussie!</h3>
              <p className="text-black">Redirection vers le hub...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
