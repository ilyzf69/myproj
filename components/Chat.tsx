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
    if (!input.trim()) return; // Éviter l'envoi de messages vides
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]); // Ajouter le message de l'utilisateur à la conversation
    setInput(""); // Réinitialiser le champ de saisie

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      const botMessage = { text: data.response.trim(), sender: "assistant" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Erreur lors de la communication avec le chatbot:', error);
      const errorMessage = { text: "Désolé, je ne fonctionne pas encore.", sender: "assistant" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="fixed top-0 right-0 m-4 max-w-md">
      <button
        className="w-16 h-16 bg-blue-500 text-white rounded-full cursor-pointer flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'CHAT' : 'CHAT'}
      </button>
      {isOpen && (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-2">
          <div className="p-4 max-h-80 overflow-auto">
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
