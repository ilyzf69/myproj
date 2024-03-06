'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { MailIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Hub from '../hub/pages/hub/page';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [redirectToHub, setRedirectToHub] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowConfirmation(true);
      setTimeout(() => {
        window.location.href = "/hub";
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur est survenue lors de l’inscription.');
      }
    }
  };

  return (
    <>
    

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-50">
          <div className="m-auto bg-white p-5 rounded-lg flex flex-col items-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h3 className="mt-2 text-lg font-semibold">Inscription réussie!</h3>
            <p>Redirection vers le hub...</p>
          </div>
        </div>
      )}


<div className="fixed inset-0 overflow-hidden z-0">
  <iframe
    className="absolute inset-0 w-full h-full"
    style={{ filter: 'blur(8px)' }}
    src="https://www.youtube.com/embed/lR9a4fgegi4?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=lR9a4fgegi4&mute=1"
    frameBorder="0"
    allow="autoplay; encrypted-media"
    allowFullScreen
    title="Video Background"
  ></iframe>
  <div className="absolute inset-0 bg-black bg-opacity-50"></div> 
</div>

<div className="flex items-center justify-center min-h-screen z-10 bg-black bg-opacity-50">
  <div className="px-8 py-6 text-left bg-gray-800 text-white shadow-xl rounded-lg" style={{ zIndex: 20 }}>
    <h3 className="text-2xl font-bold text-center">Inscription</h3>
    {error && <p className="text-red-500 text-xs">{error}</p>}
    <form onSubmit={handleSubmit}>
      <div className="mt-4">
        <label className="block relative" htmlFor="email">
          <MailIcon className="h-5 w-5 text-gray-300 absolute left-3 top-3" />
          <input
            className="form-input mt-1 block w-full pl-10 pr-4 py-2 bg-gray-700 border-none rounded-md"
            type="email"
            name="email"
            placeholder="Email"
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
        <label className="block mt-4 relative" htmlFor="confirmPassword">
          <LockClosedIcon className="h-5 w-5 text-gray-300 absolute left-3 top-3" />
          <input
            className="form-input mt-1 block w-full pl-10 pr-4 py-2 bg-gray-700 border-none rounded-md"
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <div className="flex items-center justify-between mt-4">
          <button
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
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

export default Register;
