import admin from 'firebase-admin';

const serviceAccount = require('path/dentials.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://feels-ia-default-rtdb.firebaseio.com" // Si vous utilisez la Realtime Database (pas nécessaire pour Firestore)
  });
}

export default admin;
