const admin = require('firebase-admin');
const db = admin.firestore();

exports.getPublicWorkouts = async (req, res) => {
  try {
    const snapshot = await db.collection('workouts').orderBy('createdAt', 'desc').get();
    const workouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSavedWorkouts = async (req, res) => {
  try {
    const uid = req.user.uid;
    const snapshot = await db.collection('savedWorkouts').where('userId', '==', uid).get();
    const savedIds = snapshot.docs.map(doc => doc.data().workoutId);
    
    if (savedIds.length === 0) return res.status(200).json([]);

    const workoutsSnapshot = await db.collection('workouts')
      .where(admin.firestore.FieldPath.documentId(), 'in', savedIds).get();

    const savedWorkouts = workoutsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(savedWorkouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveWorkout = async (req, res) => {
  try {
    const { workoutId } = req.body;
    const uid = req.user.uid;

    const existing = await db.collection('savedWorkouts')
      .where('userId', '==', uid).where('workoutId', '==', workoutId).get();

    if (!existing.empty) {
      return res.status(400).json({ error: "Antrenamentul este deja salvat!" });
    }

    await db.collection('savedWorkouts').add({
      userId: uid, workoutId, savedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ message: "Salvat!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeSavedWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const snapshot = await db.collection('savedWorkouts')
      .where('userId', '==', uid).where('workoutId', '==', id).get();

    if (snapshot.empty) return res.status(404).json({ error: "Nu a fost găsit în profil" }); // Tratează eroarea 404
    
    await db.collection('savedWorkouts').doc(snapshot.docs[0].id).delete();
    res.status(200).json({ message: "Eliminat!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const { title, description, duration, category, difficulty } = req.body;
    const newWorkout = {
      title, description: description || "", duration: Number(duration), category, difficulty,
      userId: req.user.uid, createdAt: admin.firestore.FieldValue.serverTimestamp()
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
    const docRef = db.collection('workouts').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Nu există" });
    if (doc.data().userId !== req.user.uid) return res.status(403).json({ error: "Interzis" });
    
    await docRef.update({ ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(200).json({ message: "Actualizat!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const docRef = db.collection('workouts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Antrenamentul nu a fost găsit." });
    }

    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Nu ai permisiunea să ștergi acest antrenament global!" });
    }

    await docRef.delete();

    const savedSnapshot = await db.collection('savedWorkouts')
      .where('workoutId', '==', id)
      .get();

    const batch = db.batch();
    savedSnapshot.forEach(d => batch.delete(d.ref));
    await batch.commit();

    res.status(200).json({ message: "Antrenament șters definitiv din HoopLab." });
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

    if (!doc.exists) return res.status(404).json({ error: "Antrenamentul nu există." });
    
    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Nu poți edita antrenamentele altora!" });
    }

    await docRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "Antrenament actualizat cu succes!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};