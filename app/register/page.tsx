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
            <p>Redirection vers l'accueil...</p>
          </div>
        </div>
      )}


<div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-0">
        <div className="absolute inset-0 filter blur-lg">
          <Hub />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen z-10">
        <div className="px-8 py-6 text-left bg-gray-800 text-white shadow-lg" style={{ zIndex: 20 }}>
          <h3 className="text-2xl font-bold text-center">S'inscrire</h3>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4 bg-gray-700">
                <MailIcon className="h-5 w-5 text-gray-300" />
                <input className="pl-2 outline-none border-none bg-transparent text-white" type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl bg-gray-700">
                <LockClosedIcon className="h-5 w-5 text-gray-300" />
                <input className="pl-2 outline-none border-none bg-transparent text-white" type="password" name="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl bg-gray-700">
                <LockClosedIcon className="h-5 w-5 text-gray-300" />
                <input className="pl-2 outline-none border-none bg-transparent text-white" type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <div className="flex items-center justify-between mt-4">
                <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700" type="submit">
                  S'inscrire
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
