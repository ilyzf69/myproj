'use client'
import React, { useEffect, useState } from 'react';
import Hub from '../hub/pages/hub/page';
import Login from '../login/page';

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

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Connecté avec succès');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Échec de la connexion', error.message);
        alert('Échec de la connexion : ' + error.message);
      } else {
        // Si l'erreur n'est pas une instance de Error, elle reste de type 'unknown'
        console.error('Une erreur inconnue est survenue');
        alert('Une erreur inconnue est survenue');
      }
    }
  };
  

  return isLoggedIn ? <Hub /> : <Login />;

};

export default App;
