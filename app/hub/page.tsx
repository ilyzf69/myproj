'use client'
import React, { useState, useEffect } from 'react';
import Test from '../test/page'; // Assurez-vous que le chemin est correct
import Login from './LoginForm'; // Assurez-vous que le chemin est correct et que le composant s'appelle Login
import { auth } from '../firebaseConfig'; // import Login from '../login/page';
import { signInWithEmailAndPassword } from 'firebase/auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      if (user) {
        console.log('Utilisateur connecté', user);
      }
    });

    return () => unsubscribe(); // Nettoyer l'abonnement
  }, []);

  // Si l'utilisateur est connecté, affichez le composant Test, sinon affichez le composant Login
  return isLoggedIn ? <Test /> : <Login/>;
};

export default App;
