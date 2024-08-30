"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import {
  UserGroupIcon,
  PlusCircleIcon,
  ChatIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import {
  db,
  auth
} from '../../../firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import {
  onAuthStateChanged
} from "firebase/auth";

const GroupesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupes, setGroupes] = useState<any[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState('');
  const [showChat, setShowChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showMembers, setShowMembers] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJoinedGroups(docSnap.data().joinedGroups || []);
          fetchFavorites(user.uid);
        } else {
          console.log("No such document!");
        }
      }
    });

    fetchGroups();

    return () => unsubscribe();
  }, []);

  const fetchGroups = async () => {
    const groupsCollection = collection(db, "groups");
    const groupsSnapshot = await getDocs(groupsCollection);
    const fetchedGroups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setGroupes(fetchedGroups);
  };

  const fetchFavorites = async (userId: string) => {
    const favoritesCollection = collection(db, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesCollection);
    const fetchedFavorites = favoritesSnapshot.docs.map(doc => doc.data());
    setFavorites(fetchedFavorites);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleJoinGroup = async (groupName: string) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        joinedGroups: arrayUnion(groupName)
      });
      setJoinedGroups([...joinedGroups, groupName]);

      const groupRef = doc(db, "groups", groupName);
      await updateDoc(groupRef, {
        members: arrayUnion(user.uid)
      });
    }
  };

  const handleLeaveGroup = async (groupName: string) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        joinedGroups: arrayRemove(groupName)
      });
      setJoinedGroups(joinedGroups.filter(group => group !== groupName));

      const groupRef = doc(db, "groups", groupName);
      await updateDoc(groupRef, {
        members: arrayRemove(user.uid)
      });
    }
  };

  const handleCreateGroup = async () => {
    if (user && newGroupName && selectedFavorite) {
      const newGroup = {
        name: newGroupName,
        description: `Groupe créé par ${user.email}`,
        music: selectedFavorite,
        members: [user.uid],
      };
      await setDoc(doc(db, "groups", newGroupName), newGroup);
      setGroupes([...groupes, { id: newGroupName, ...newGroup }]);
      setShowCreatePopup(false);
    }
  };

  const handleSendMessage = async () => {
    if (user && newMessage && showChat) {
      const message = {
        text: newMessage,
        sender: user.email,
        timestamp: new Date(),
      };

      await setDoc(doc(db, `groups/${showChat}/messages`, `${Date.now()}`), message);
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const fetchMessages = async (groupName: string) => {
    const messagesCollection = collection(db, `groups/${groupName}/messages`);
    onSnapshot(messagesCollection, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => doc.data());
      setMessages(fetchedMessages);
    });
  };

  const fetchMembers = async (groupName: string) => {
    const groupRef = doc(db, "groups", groupName);
    const groupSnap = await getDoc(groupRef);
    if (groupSnap.exists()) {
      const memberIds = groupSnap.data().members || [];
      const memberPromises = memberIds.map((memberId: string) => getDoc(doc(db, "users", memberId)));
      const memberDocs = await Promise.all(memberPromises);
      const fetchedMembers = memberDocs.map(docSnap => docSnap.data());
      setMembers(fetchedMembers);
    }
  };

  const openChat = (groupName: string) => {
    setShowChat(groupName);
    fetchMessages(groupName);
    fetchMembers(groupName);
  };

  const openMembers = (groupName: string) => {
    setShowMembers(groupName);
    fetchMembers(groupName);
  };

  const filteredGroupes = groupes.filter((groupe) =>
    groupe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center p-6 ">
        <h1 className="text-5xl font-extrabold text-white mb-8">Communauté !</h1>
        <div className="mb-6 w-full max-w-2xl flex">
          <input
            type="text"
            className="w-full p-3 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring focus:border-white placeholder-gray-300 text-gray-700"
            placeholder="Rechercher des groupes..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="ml-2 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition"
            onClick={() => setShowCreatePopup(true)}
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-4xl font-bold text-white mt-10 mb-6">Vos communautés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {joinedGroups.length > 0 ? (
            joinedGroups.map((groupName, index) => (
              <div key={index} className="p-6 bg-white bg-opacity-20 rounded-lg shadow-lg flex items-center">
                <UserGroupIcon className="w-10 h-10 text-blue-500 mr-4" />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white">{groupName}</h3>
                </div>
                <button
                  onClick={() => handleLeaveGroup(groupName)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Quitter
                </button>
              </div>
            ))
          ) : (
            <p className="text-white">Vous n avez rejoint aucune communauté.</p>
          )}
        </div>
        <h2 className="text-4xl font-bold text-white mt-10 mb-6">Groupes disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl ">
          {filteredGroupes.map(({ id, name, description, members }) => (
            <div key={id} className="p-6 bg-white bg-opacity-20 rounded-lg shadow-lg flex flex-col">
              <div className="flex items-center mb-2">
                <UserGroupIcon className="w-10 h-10 text-blue-500 mr-4" />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-white">{name}</h3>
                  <p className="text-white">{description}</p>
                  <p className="text-white">Membres : {members ? members.length : 1}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={() => openChat(name)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  <ChatIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openMembers(name)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <InformationCircleIcon className="w-6 h-6" />
                </button>
                {joinedGroups.includes(name) ? (
                  <button
                    onClick={() => handleLeaveGroup(name)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Quitter
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(name)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Rejoindre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link href="/hub">
          <p className="mt-10 p-4 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center">
            Retour au Hub
          </p>
        </Link>
      </div>
      {showCreatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Créer un groupe</h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowCreatePopup(false)}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Nom du groupe"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={selectedFavorite}
              onChange={(e) => setSelectedFavorite(e.target.value)}
            >
              <option value="">Sélectionnez une musique</option>
              {favorites.map((favorite, index) => (
                <option key={index} value={favorite.id}>
                  {favorite.title}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition mr-2"
                onClick={() => setShowCreatePopup(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                onClick={handleCreateGroup}
                disabled={!newGroupName || !selectedFavorite}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/4 flex flex-col text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chat du groupe {showChat}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowChat(null)}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 p-2 rounded-lg shadow ${message.sender === user.email ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <p className="text-sm text-gray-700">{message.sender}</p>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
            <div className="flex mb-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                onClick={handleSendMessage}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/4 flex flex-col text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Membres du groupe {showMembers}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowMembers(null)}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {members.map((member, index) => (
                <div key={index} className="mb-2 p-2 rounded-lg shadow bg-gray-100">
                  <p>{member?.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupesPage;
