'use client'
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(messages => [...messages, userMessage]);

    // Simuler une réponse de l'API
    const botResponse = `Réponse simulée pour "${input}"`;
    const botMessage: Message = { id: Date.now() + 1, text: botResponse, sender: 'bot' };

    setMessages(messages => [...messages, botMessage]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
        <Sidebar />
      <div className="m-auto w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg p-4">
          <div className="mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`text-sm p-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block rounded-lg p-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="w-full p-2 border-2 border-r-0 border-gray-300 rounded-l-lg focus:outline-none"
              placeholder="Tapez votre message ici..."
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r-lg">
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
