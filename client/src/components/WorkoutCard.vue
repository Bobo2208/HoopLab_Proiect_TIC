<script setup>
defineProps(['workout']);
</script>

<template>
  <div class="workout-card">
    <div class="card-header">
      <span class="category-tag">{{ workout.category }}</span>
      <span :class="['badge', workout.difficulty?.toLowerCase()]">
        {{ workout.difficulty || 'Rookie' }}
      </span>
    </div>
    
    <h3>{{ workout.title }}</h3>
    <p class="description">{{ workout.description }}</p>
    
    <div class="meta">
      <span class="duration-info">⏱️ {{ workout.duration }} minute</span>
    </div>
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
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
  white-space: pre-line;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
}

.badge.rookie { background: #e8f5e9; color: #2e7d32; }
.badge.sophomore { background: #fff3e0; color: #ef6c00; }
.badge.pro { background: #ffebee; color: #c62828; }
.badge.default { background: #f5f5f5; color: #757575; }

.meta {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f5f5f5;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}
</style>