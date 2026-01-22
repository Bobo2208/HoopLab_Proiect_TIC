<script setup>
import { ref, onMounted } from 'vue';
import WorkoutCard from '../components/WorkoutCard.vue';
import { auth } from '../firebase';

const workouts = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      isLoading.value = false;
      return;
    }

    const token = await user.getIdToken();

    const res = await fetch('http://localhost:3000/api/workouts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Acces interzis");
    }

    workouts.value = await res.json();
  } catch (err) {
    console.error(err.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="home">
    <header class="section-header">
      <h2> Antrenamente Disponibile</h2>
    </header>

    <div v-if="isLoading" class="loading-state">
      Se încarcă...
    </div>

    <div v-else-if="workouts.length === 0" class="empty">
      <p>Nu există antrenamente disponibile.</p>
    </div>

    <div v-else class="workout-grid">
      <WorkoutCard v-for="item in workouts" :key="item.id" :workout="item" />
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.loading-state, .empty {
  text-align: center;
  margin-top: 60px;
  font-size: 1.2rem;
  color: #777;
}

.workout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}
</style>