"use client";
import React, { useState } from "react";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Bonjour, je suis Chatbot. Comment puis-je vous aider ?",
      sender: "assistant",
    },
  ]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const { content, role } = await res.json();
        setMessages((prevMessages) => [...prevMessages, { text: content, sender: role }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 w-full max-w-md">
      <button
        className="w-16 h-16 bg-blue-500 text-white rounded-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Fermer' : 'Chat'}
      </button>

      {isOpen && (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`text-sm p-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
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
              className="w-full p-2 border-2 border-r-0 border-gray-300 rounded-l-lg focus:outline-none"
              placeholder="Tapez votre message ici..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
