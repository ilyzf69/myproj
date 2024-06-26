"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../app/firebaseConfig';

// Définissez le type pour le contexte
interface AuthContextType {
  currentUser: User | null;
}

// Créez le contexte avec un type explicite
const AuthContext = createContext<AuthContextType>({ currentUser: null });

export const useAuth = () => useContext(AuthContext);

// Définissez un type pour les props de AuthProvider
interface AuthProviderProps {
  children: ReactNode;  // Utilisez ReactNode pour les enfants
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Utilisez le bon type pour le state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);  // Pas d'erreur ici car le type correspond
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
