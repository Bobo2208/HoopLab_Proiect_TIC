<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const auth = getAuth();

const login = async () => {
  if (!email.value || !password.value) {
    alert("Fără email și parolă e ca și cum ai încerca să dai dunk fără minge.");
    return;
  }

  loading.ref = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/'); 
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      alert("Datele de autentificare sunt incorecte.");
    } else {
      alert("Eroare la autentificare: " + err.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="logo-area">
        <h1>HoopLab</h1>
        <p>Intră în arena antrenamentelor</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <h2>Autentificare</h2>
        
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" required />
        </div>

        <div class="input-group">
          <input v-model="password" type="password" placeholder="Parola" required />
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Se verifică datele...' : 'Intră în cont' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Nu ai cont? <router-link to="/register">Creează unul aici</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
}

.logo-area h1 {
  font-size: 2.5rem;
  color: #ff6600;
  margin: 0;
  font-weight: 900;
}

.logo-area p {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #ff6600;
}

.login-btn {
  background: #ff6600;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  background: #e65c00;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 25px;
  font-size: 0.9rem;
  color: #666;
}

.auth-footer a {
  color: #ff6600;
  text-decoration: none;
  font-weight: bold;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>