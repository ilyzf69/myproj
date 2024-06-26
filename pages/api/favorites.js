import admin from './firebaseAdmin';

const db = admin.firestore();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const snapshot = await db.collection('favorites').get();
        const favorites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(favorites);
        break;
      case 'POST':
        const music = req.body;
        await db.collection('favorites').doc(music.id).set(music);
        res.status(201).json(music);
        break;
      case 'DELETE':
        const { id } = req.query;
        await db.collection('favorites').doc(id).delete();
        res.status(200).json({ id });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
