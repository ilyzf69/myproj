// Exemple en JavaScript avec fetch

const apiKey = 'VOTRE_CLÉ_API';
const endpoint = 'https://api.openai.com/v1/completions';

const sendMessageToChatbot = async (message: string) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-002', // Modèle ChatGPT à utiliser
        prompt: message, // Message à envoyer au modèle
        max_tokens: 150, // Nombre maximal de jetons générés
      }),
    });
    
    const data = await response.json();
    return data.choices[0].text.trim(); // Récupérer la réponse du chatbot
  } catch (error) {
    console.error('Erreur lors de la requête au serveur:', error);
    return 'Erreur lors de la communication avec le chatbot.';
  }
};

// Utilisation de la fonction pour envoyer un message et afficher la réponse
const userMessage = 'Bonjour, comment ça va ?';
sendMessageToChatbot(userMessage)
  .then((response) => {
    console.log('Réponse du chatbot:', response);
    // Afficher la réponse dans votre application
  })
  .catch((error) => {
    console.error('Erreur:', error);
  });
