<script setup>
import { ref, computed } from 'vue';
import { auth } from '../firebase';
import { useWorkoutStore } from '../stores/workoutStore';

const props = defineProps(['workout']);
const store = useWorkoutStore();

const isEditing = ref(false);
const editData = ref({ ...props.workout });

const isOwner = computed(() => {
  return auth.currentUser && props.workout.userId === auth.currentUser.uid;
});

const isAlreadySaved = computed(() => {
  return store.savedWorkouts.some(sw => sw.id === props.workout.id);
});

const startEdit = () => {
  editData.value = { ...props.workout };
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const handleUpdate = async () => {
  const success = await store.updateWorkout(props.workout.id, editData.value);
  if (success) {
    isEditing.value = false;
    alert("Antrenament actualizat cu succes!");
  }
};
</script>

<template>
  <div class="workout-card">
    <template v-if="!isEditing">
      <div class="card-header">
        <span class="category-tag">{{ workout.category }}</span>
        <span :class="['badge', workout.difficulty?.toLowerCase() || 'rookie']">
          {{ workout.difficulty || 'Rookie' }}
        </span>
      </div>
      
      <div class="card-body">
        <h3>{{ workout.title }}</h3>
        <p v-if="workout.description" class="description">
          {{ workout.description }}
        </p>
      </div>
      
      <div class="meta">
        <span class="duration-info">{{ workout.duration }} minute</span>
      </div>

      <div class="card-actions">
        <button 
          v-if="!isAlreadySaved"
          @click="store.saveToMyProfile(workout.id)"
          class="action-btn save"
        >
          Salvează în Profil
        </button>

        <button 
          v-if="isOwner"
          @click="startEdit"
          class="action-btn edit"
        >
          Editează Datele
        </button>

        <button 
          v-if="isOwner"
          @click="store.deleteWorkoutPermanently(workout.id)"
          class="action-btn delete-global"
        >
          Șterge Global
        </button>
      </div>
    </template>

    <template v-else>
      <div class="edit-form">
        <h3 class="edit-title">Editare Antrenament</h3>
        
        <label>Titlu:</label>
        <input v-model="editData.title" class="edit-input" />

        <label>Descriere:</label>
        <textarea v-model="editData.description" class="edit-input" rows="3"></textarea>

        <div class="edit-row">
          <div>
            <label>Minute:</label>
            <input v-model.number="editData.duration" type="number" class="edit-input" />
          </div>
          <div>
            <label>Dificultate:</label>
            <select v-model="editData.difficulty" class="edit-input">
              <option value="Rookie">Rookie</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Pro">Pro</option>
            </select>
          </div>
        </div>

        <div class="edit-actions">
          <button @click="handleUpdate" class="action-btn save">Salvează</button>
          <button @click="cancelEdit" class="action-btn cancel">Anulează</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.workout-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.workout-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-tag {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #ff6600;
  font-weight: 800;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.description {
  font-size: 0.9rem; color: #555; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden; margin-bottom: 10px;
}

.badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; }
.badge.rookie { background: #e8f5e9; color: #2e7d32; }
.badge.sophomore { background: #fff3e0; color: #ef6c00; }
.badge.pro { background: #ffebee; color: #c62828; }

.meta { margin-top: auto; padding-top: 15px; border-top: 1px solid #f5f5f5; font-size: 0.85rem; color: #666; font-weight: 600; }

.card-actions, .edit-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }

.action-btn { width: 100%; padding: 10px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; font-size: 0.85rem; }
.save { background: #28a745; color: white; }
.edit { background: #007bff; color: white; }
.cancel { background: #6c757d; color: white; }
.delete-global { background: #fff; color: #dc3545; border: 1px solid #dc3545; }

.edit-form { display: flex; flex-direction: column; gap: 8px; text-align: left; }
.edit-title { color: #ff6600; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 5px; }
.edit-input { padding: 8px; border-radius: 4px; border: 1px solid #ddd; font-family: inherit; }
.edit-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
label { font-size: 0.8rem; font-weight: bold; color: #444; }
</style>