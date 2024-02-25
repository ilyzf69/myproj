// components/Header.tsx
import React from 'react';

export default function Header() {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg overflow-hidden relative">
      <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-yellow-300">
        FeelsIA by Paul-Ilyes
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        
      `}</style>
    </div>
  );
}
