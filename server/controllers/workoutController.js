const admin = require('firebase-admin');
const db = admin.firestore();

exports.getAllWorkouts = async (req, res) => {
  try {
    const snapshot = await db.collection('workouts')
      .where('userId', '==', req.user.uid) 
      .orderBy('createdAt', 'desc')
      .get();

    const workouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const { title, description, category, difficulty, duration } = req.body;
    
    const newWorkout = {
      title,
      description,
      category,
      difficulty,
      duration: Number(duration),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userId: req.user.uid 
    };

    const docRef = await db.collection('workouts').add(newWorkout);
    res.status(201).json({ id: docRef.id, ...newWorkout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const updates = req.body;

    const docRef = db.collection('workouts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Antrenamentul nu a fost gasit" });
    }

    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Nu ai permisiunea sa editezi acest antrenament" });
    }

    await docRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "Antrenament actualizat cu succes" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizare: " + error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid; 

    const docRef = db.collection('workouts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Antrenamentul nu a fost gasit" });
    }

    if (doc.data().userId !== uid) {
      return res.status(403).json({ 
        error: "Acces interzis: Poti sterge doar antrenamentele create de tine!" 
      });
    }

    await docRef.delete();
    res.status(200).json({ message: "Antrenament sters cu succes" });

  } catch (error) {
    res.status(500).json({ error: "Eroare la stergere: " + error.message });
  }
};