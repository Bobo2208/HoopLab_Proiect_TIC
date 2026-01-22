const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 
const checkAuth = require('./authMiddleware');
require('dotenv').config();


const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 

app.get('/', (req, res) => {
  res.send('Serverul HoopLab este pornit și gata de baschet!');
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get('/test-db', async (req, res) => {
  try {
    const testRef = db.collection('test').doc('hooplab');
    await testRef.set({
      mesaj: "Conexiunea merge",
      data: new Date()
    });
    res.send("Succes! Verifica consola in Firebase");
  } catch (error) {
    res.status(500).send("Eroare: " + error.message);
  }
});

app.get('/api/workouts', checkAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('workouts').get();
    const workouts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(workouts); 
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea datelor: " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[HoopLab] Serverul rulează pe http://localhost:${PORT}`);
});

