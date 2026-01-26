const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
require('dotenv').config();

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const checkAuth = require('./authMiddleware');
const workoutController = require('./controllers/workoutController');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/workouts/public', checkAuth, workoutController.getPublicWorkouts);
app.get('/api/workouts/saved', checkAuth, workoutController.getUserSavedWorkouts);
app.post('/api/workouts/save', checkAuth, workoutController.saveWorkout);
app.delete('/api/workouts/saved/:id', checkAuth, workoutController.removeSavedWorkout);

app.post('/api/workouts', checkAuth, workoutController.createWorkout);
app.patch('/api/workouts/:id', checkAuth, workoutController.updateWorkout);
app.delete('/api/workouts/:id', checkAuth, workoutController.deleteWorkout);

const PORT = 3000;
app.listen(PORT, () => console.log(`[HoopLab] Server pornit pe portul ${PORT}`));