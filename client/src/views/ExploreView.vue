<script setup>
import { ref, computed, onMounted } from 'vue';
import { auth } from '../firebase'; 
import { useWorkoutStore } from '../stores/workoutStore';
import WorkoutCard from '../components/WorkoutCard.vue';

const store = useWorkoutStore();


const filterCategory = ref('');
const filterDifficulty = ref('');
const sortByDuration = ref('asc'); 
const showOnlyMine = ref(false);

onMounted(async () => {
  await store.fetchPublicWorkouts();
  await store.fetchSavedWorkouts(); 
});

const filteredWorkouts = computed(() => {
  let results = [...store.publicWorkouts];

  if (showOnlyMine.value && auth.currentUser) {
    results = results.filter(w => w.userId === auth.currentUser.uid);
  }

  if (filterCategory.value) {
    results = results.filter(w => 
      w.category?.toLowerCase() === filterCategory.value.toLowerCase()
    );
  }

  if (filterDifficulty.value) {
    results = results.filter(w => 
      w.difficulty?.toLowerCase() === filterDifficulty.value.toLowerCase()
    );
  }

  results.sort((a, b) => {
    const timeA = Number(a.duration) || 0;
    const timeB = Number(b.duration) || 0;

    return sortByDuration.value === 'asc' 
      ? timeA - timeB 
      : timeB - timeA;
  });

  return results;
});
</script>

<template>
  <div class="explore-container">
    <header class="explore-header">
      <h1>Biblioteca Globală HoopLab</h1>
      <p>Descoperă antrenamentele potrivite pentru timpul tău disponibil.</p>
    </header>

    <div class="controls-bar">
      <div class="filter-group">
        <select v-model="filterCategory">
          <option value="">Toate Categoriile</option>
          <option value="Shooting">Shooting</option>
          <option value="Dribbling">Dribbling</option>
          <option value="Defense">Defense</option>
          <option value="Conditioning">Conditioning</option>
          <option value="Passing">Passing</option>
        </select>

        <select v-model="filterDifficulty">
          <option value="">Toate Nivelurile</option>
          <option value="Rookie">Rookie</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Pro">Pro</option>
        </select>
      </div>

      <div class="mine-toggle">
        <label class="toggle-container">
          <input type="checkbox" v-model="showOnlyMine">
          <span class="toggle-text">Doar creațiile mele</span>
        </label>
      </div>

      <div class="sort-group">
        <label>Ordonează:</label>
        <select v-model="sortByDuration">
          <option value="asc">Timp (Scurt → Lung)</option>
          <option value="desc">Timp (Lung → Scurt)</option>
        </select>
      </div>
    </div>

    <div v-if="store.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Se caută antrenamente...</p>
    </div>

    <div v-else-if="filteredWorkouts.length === 0" class="empty-state">
      <p v-if="store.publicWorkouts.length === 0">
        Biblioteca este goală momentan. Fii tu primul creator!
      </p>
      <p v-else>
        Niciun antrenament nu se potrivește criteriilor selectate.
      </p>
    </div>

    <div v-else class="workout-grid">
      <div v-for="workout in filteredWorkouts" :key="workout.id" class="card-wrapper">
        <WorkoutCard :workout="workout" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
.explore-header { text-align: center; margin-bottom: 30px; }

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex-wrap: wrap;
}

.filter-group, .sort-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.mine-toggle {
  background: white;
  padding: 8px 15px;
  border-radius: 30px;
  border: 1px solid #ddd;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.toggle-container input {
  accent-color: #ff6600;
  width: 18px;
  height: 18px;
}

.sort-group label {
  font-size: 0.85rem;
  font-weight: 800;
  color: #666;
  text-transform: uppercase;
}

select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
}

select:focus {
  border-color: #ff6600;
  outline: none;
}

.workout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 20px 0;
}

.card-wrapper {
  transition: transform 0.3s ease;
  padding: 15px;
}

.card-wrapper:hover {
  transform: translateY(-8px);
}

.loading-state, .empty-state { text-align: center; margin-top: 60px; color: #888; }

.spinner { 
  border: 4px solid rgba(0,0,0,0.1); 
  width: 45px; height: 45px; 
  border-radius: 50%; 
  border-left-color: #ff6600; 
  animation: spin 1s linear infinite; 
  margin: 0 auto 20px;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .controls-bar { flex-direction: column; align-items: stretch; }
  .filter-group, .mine-toggle, .sort-group { justify-content: center; }
}
</style>