'use client'
import React, { useState, useEffect } from 'react';
import Test from '../test/page'; // Assurez-vous que le chemin est correct
import Login from './LoginForm'; // Assurez-vous que le chemin est correct et que le composant s'appelle Login

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ici, vous pouvez vérifier si l'utilisateur est connecté, par exemple en vérifiant un token dans localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (username, password) => {
    // Logique pour tenter de se connecter...
    // Si la connexion est réussie:
    setIsLoggedIn(true);
    localStorage.setItem('userToken', 'yourTokenHere'); // Stockez le token ou un indicateur de connexion
  };

  // Si l'utilisateur est connecté, affichez le composant Test, sinon affichez le composant Login
  return isLoggedIn ? <Test /> : <Login onLogin={handleLogin} />;
};

export default App;
