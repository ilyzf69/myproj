// components/Popup.tsx
import React from 'react';

interface PopupProps {
  message: string;
  isVisible: boolean; // Contrôlez cette prop depuis le parent ou via le routage
}

export default function Popup({ message, isVisible }: PopupProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 rounded-lg shadow-lg">
      {message}
    </div>
  );
}
