// pages/inscription.tsx ou un autre fichier de votre choix

import dynamic from 'next/dynamic';
import React from 'react';
import Test from '../test/page'; // Assurez-vous que le chemin est correct

// Importez le formulaire d'inscription comme un composant client
const InscriptionForm = dynamic(() => import('./InscriptionForm'), {
  ssr: false,
});

const InscriptionPage = () => {
  return (
    <>
      {/* Arrière-plan flou et tout autre contenu de la page */}
      <InscriptionForm />
    </>
  );
};

export default InscriptionPage;
