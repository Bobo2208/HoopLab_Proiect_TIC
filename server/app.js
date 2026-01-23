const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const checkAuth = require('./authMiddleware');
const workoutController = require('./controllers/workoutController');

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 

app.get('/', (req, res) => {
  res.send('Serverul HoopLab este gata de acțiune! 🏀');
});

app.get('/api/workouts', checkAuth, workoutController.getAllWorkouts);

app.post('/api/workouts', checkAuth, workoutController.createWorkout);

app.patch('/api/workouts/:id', checkAuth, workoutController.updateWorkout);

app.delete('/api/workouts/:id', checkAuth, workoutController.deleteWorkout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[HoopLab] Serverul rulează pe http://localhost:${PORT}`);
});