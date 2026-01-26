<script setup>
import { onMounted } from 'vue';
import { useWorkoutStore } from '../stores/workoutStore';
import WorkoutCard from '../components/WorkoutCard.vue';
import WorkoutForm from '../components/WorkoutForm.vue';

const store = useWorkoutStore();

onMounted(() => {
  store.fetchSavedWorkouts(); //
});
</script>

<template>
  <main class="profile-container">
    <header class="profile-header">
      <h1>Profilul Meu HoopLab</h1>
      <p>Gestionează-ți antrenamentele și creează conținut nou pentru comunitate.</p>
    </header>
    
    <section class="form-section">
      <WorkoutForm />
    </section>

    <hr class="separator" />

    <section class="saved-section">
      <h2>Antrenamente Salvate</h2>
      
      <div v-if="store.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Se încarcă profilul...</p>
      </div>

      <div v-else-if="store.savedWorkouts.length === 0" class="empty-state">
        <p>Nu ai salvat încă niciun antrenament. Mergi la Explorează!</p>
      </div>

      <div v-else class="workout-grid">
        <div v-for="workout in store.savedWorkouts" :key="workout.id" class="workout-item">
          <WorkoutCard :workout="workout" />
          
          <button @click="store.removeFromSaved(workout.id)" class="remove-btn">
            <span class="icon"></span> Elimină din profil
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.separator {
  margin: 40px 0;
  border: 0;
  border-top: 2px solid #eee;
}

.workout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.workout-item {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.remove-btn {
  margin-top: 12px;
  padding: 12px;
  background-color: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.remove-btn .icon {
  font-size: 1.1rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 50px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6600;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>