const admin = require('firebase-admin');
const { faker } = require('@faker-js/faker');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function generateWorkouts(count = 50) {
  const collectionRef = db.collection('workouts');
  const categories = ['Shooting', 'Dribbling', 'Defense', 'Conditioning', 'Passing'];
  const difficulties = ['rookie', 'sophomore', 'pro'];

  console.log(`Se pornește generarea celor ${count} antrenamente...`);

  for (let i = 0; i < count; i++) {
    const workout = {
      title: faker.company.catchPhraseAdjective() + " " + faker.helpers.arrayElement(['Drill', 'Workout', 'Challenge']),
      description: faker.lorem.paragraph(2),
      category: faker.helpers.arrayElement(categories),
      difficulty: faker.helpers.arrayElement(difficulties),
      duration: faker.number.int({ min: 10, max: 120 }),
      createdAt: admin.firestore.Timestamp.now() 
    };

    await collectionRef.add(workout);
    if ((i + 1) % 10 === 0) console.log(` Am generat ${i + 1} antrenamente...`);
  }

  console.log("Succes! Baza de date a fost populată.");
  process.exit(); 
}

generateWorkouts(50);