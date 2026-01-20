<script setup>
import { ref, onMounted } from 'vue';
import WorkoutCard from '../components/WorkoutCard.vue';

const workouts = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/workouts');
    workouts.value = await res.json();
  } catch (err) {
    console.error("Serverul nu raspunde");
  }
});
</script>

<template>
  <div class="home">
    <h2>Antrenamente Disponibile</h2>
    <div v-if="workouts.length === 0" class="empty">
      Nu am gasit antrenamente
    </div>
    <div class="workout-grid">
      <WorkoutCard v-for="item in workouts" :key="item.id" :workout="item" />
    </div>
  </div>
</template>

<style scoped>
.workout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
}
</style>