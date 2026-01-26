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
    <div class="logo" @click="router.push('/')">HoopLab</div>
    
    <div v-if="isLoggedIn" class="menu">
      <router-link to="/" class="nav-link">Profilul Meu</router-link>
      <router-link to="/explore" class="nav-link">Explorează</router-link>
      
      <button @click="handleLogout" class="logout-btn">
        Ieșire
      </button>
    </div>
  </nav>

  <div class="main-content">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f4f4f4;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background: #1a1a1a;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6600;
  cursor: pointer;
}

.menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ff6600;
}

.router-link-active {
  color: white !important;
  border-bottom: 2px solid #ff6600;
}

.logout-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #cc0000;
}

.main-content {
  padding: 20px;
}
</style>