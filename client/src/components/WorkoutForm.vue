<script setup>
import { ref } from 'vue';
import { useWorkoutStore } from '../stores/workoutStore';

const store = useWorkoutStore();
const title = ref('');
const description = ref('');
const duration = ref(15);
const category = ref('Shooting');
const difficulty = ref('Rookie');

const handleSubmit = async () => {
  if (!title.value || !description.value) {
    return alert("Te rugăm să adaugi un titlu și o descriere!");
  }
  
  await store.createNewWorkout({
    title: title.value,
    description: description.value,
    duration: duration.value,
    category: category.value,
    difficulty: difficulty.value
  });

  title.value = '';
  description.value = '';
  duration.value = 15;
};
</script>

<template>
  <div class="form-card">
    <h3>Creează un nou antrenament</h3>
    <form @submit.prevent="handleSubmit">
      <input v-model="title" placeholder="Titlu (ex: Killer Crossover)" class="input-field" />
      
      <textarea 
        v-model="description" 
        placeholder="Descrie exercițiile pas cu pas..." 
        rows="4"
        class="input-field"
      ></textarea>

      <div class="row">
        <div class="col">
          <label>Minute:</label>
          <input v-model.number="duration" type="number" />
        </div>
        <div class="col">
          <label>Categorie:</label>
          <select v-model="category">
            <option value="Shooting">Shooting</option>
            <option value="Dribbling">Dribbling</option>
            <option value="Defense">Defense</option>
            <option value="Conditioning">Conditioning</option>
            <option value="Passing">Passing</option>
          </select>

          <select v-model="difficulty">
          <option value="Rookie">Rookie</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Pro">Pro</option>
        </select>
        </div>
      </div>

      <button type="submit" :disabled="store.loading" class="submit-btn">
        {{ store.loading ? 'Se creează...' : 'Publică și Salvează în Profil' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-card { background: #1a1a1a; padding: 25px; border-radius: 12px; color: white; }
.input-field { 
  width: 100%; padding: 12px; margin-bottom: 15px; 
  background: #2a2a2a; border: 1px solid #444; color: white; border-radius: 6px;
}
textarea { resize: vertical; }
.row { display: flex; gap: 15px; margin-bottom: 20px; }
.col { flex: 1; display: flex; flex-direction: column; }
.submit-btn { 
  background: #ff6600; color: white; border: none; padding: 15px; 
  border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;
}
.submit-btn:disabled { background: #555; }
</style>