<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  const success = await authStore.registerUser(email.value, password.value);
  if (success) router.push('/');
};
</script>

<template>
  <div class="auth-container">
    <h1>Creează Cont HoopLab</h1>
    <form @submit.prevent="handleRegister" class="auth-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Parolă (min. 6 caractere)" required />
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Se creează contul...' : 'Înregistrează-te' }}
      </button>
    </form>
    <p>Ai deja cont? <router-link to="/login">Intră în cont</router-link></p>
  </div>
</template>

<style scoped>
.auth-container { text-align: center; max-width: 400px; margin: 100px auto; }
.auth-form { display: flex; flex-direction: column; gap: 15px; }
input { padding: 10px; border: 1px solid #ccc; }
button { background: #ff6600; color: white; padding: 12px; border: none; cursor: pointer; }
</style>