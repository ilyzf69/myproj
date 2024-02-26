





// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';
const { Configuration, OpenAIApi } = require('openai');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo", // Utilisez le modèle approprié
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      });

      res.status(200).json({ content: response.data.choices[0].message.content, role: 'assistant' });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ error: 'Error processing your request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
