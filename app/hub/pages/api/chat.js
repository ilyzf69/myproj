// pages/api/chat.js

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 150,
    });

    res.status(200).json({ response: completion.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
