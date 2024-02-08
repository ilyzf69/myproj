import React from 'react';
import logoImage from '../../image/test.png';

export default function Logo() {
  return (
    <img src={logoImage.src} alt="Logo" className="h-12 w-12" />
  );
}

