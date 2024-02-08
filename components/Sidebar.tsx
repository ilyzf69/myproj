import React from 'react';
import Link from 'next/link';
import Logo from '@/app/ui/test'; // Assurez-vous que ce composant est bien défini
import { VideoCameraIcon, CameraIcon, FireIcon, CloudUploadIcon } from '@heroicons/react/solid'; // Import des icônes appropriées

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-64 p-5 bg-gray-800 text-white">
      <div className="mb-10 flex justify-center">
        <Link href="/">
          <Logo/> {/* Assurez-vous que le logo est bien centré et visible */}
        </Link>
      </div>

      <nav className="flex flex-col space-y-4">
        <Link href="/trick">
          <p className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            <VideoCameraIcon className="h-6 w-6" />
            <span>Trickshots</span>
          </p>
        </Link>
        <Link href="/nukes">
          <p className="flex items-center gap-3 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
            <FireIcon className="h-6 w-6" />
            <span>Nukes</span>
          </p>
        </Link>
        <Link href="/clips">
          <p className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
            <CameraIcon className="h-6 w-6" />
            <span>Clips</span>
          </p>
        </Link>
        <Link href="/post">
          <p className="flex items-center gap-3 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
            <CloudUploadIcon className="h-6 w-6" />
            <span>Post Your Clip</span>
          </p>
        </Link>
      </nav>
    </div>
  );
}
