<template>
  <header class="navbar">
    <div class="logo">🏀 HoopLab</div>
    <nav>
      <router-link to="/">Acasa</router-link>
      <router-link to="/about">Despre</router-link>
    </nav>
  </header>

  <main class="container">
    <router-view /> </main>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 5%;
  background: #111;
  color: white;
}
nav a {
  color: #ccc;
  text-decoration: none;
  margin-left: 20px;
}
nav a.router-link-active { color: #ff6600; font-weight: bold; }
.container { padding: 40px 5%; }

/* Mobile Responsive */
@media (max-width: 600px) {
  .navbar { flex-direction: column; align-items: center; gap: 15px; }
}
</style>