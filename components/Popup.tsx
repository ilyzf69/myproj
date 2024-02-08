// components/Popup.tsx
import { useState } from 'react';

export default function Popup({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-4 rounded-lg shadow-lg">
        {message}
      </div>
    )
  );
}
