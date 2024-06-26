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
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Utilisez le modèle correct disponible
      prompt: prompt,
      max_tokens: 150,
    });

    res.status(200).json({ response: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
