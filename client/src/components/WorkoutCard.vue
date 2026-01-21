<script setup>
defineProps(['workout']);
</script>

<template>
  <div class="workout-card">
    <div class="category-tag">{{ workout.category }}</div>
    <h3>{{ workout.title }}</h3>
    <p>{{ workout.description }}</p>
    <div class="details">
      <span> {{ workout.duration }} min </span>
      <span :class="['difficulty', workout.difficulty.toLowerCase()]">
        {{ workout.difficulty }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.workout-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.category-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #ff6600;
  font-weight: bold;
}
.difficulty.pro { color: #d32f2f; }
.difficulty.sosophomore { color: #f9a825; }
.difficulty.rookie { color: #388e3c; }
</style>