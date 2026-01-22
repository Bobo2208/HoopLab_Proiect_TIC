<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = getAuth();

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/'); // Redirecționăm la pagina principală
  } catch (err) {
    alert("Eroare: " + err.message);
  }
};
</script>

<template>
  <div class="auth-container">
    <h2>Autentificare HoopLab</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Parola" />
    <button @click="login">Intra în cont</button>
  </div>
</template>

<style scoped>
.auth-container { max-width: 300px; margin: 50px auto; display: flex; flex-direction: column; gap: 10px; }
button { background: #ff6600; color: white; border: none; padding: 10px; cursor: pointer; }
</style>