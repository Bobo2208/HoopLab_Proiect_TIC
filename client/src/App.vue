<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Utilizator delogat cu succes");
    router.push('/login'); 
  } catch (error) {
    console.error("Eroare la logout:", error);
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="logo">HoopLab </div>
    <div class="menu">
      <router-link to="/">Antrenamente</router-link>
      <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
        Ieșire
      </button>
    </div>
  </nav>

  <router-view />
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1a1a1a;
  color: white;
}
.logout-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
}
.logout-btn:hover {
  background: #cc0000;
}
</style>