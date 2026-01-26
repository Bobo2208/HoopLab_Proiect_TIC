import { defineStore } from 'pinia';
import { auth } from '../firebase';

export const useWorkoutStore = defineStore('workoutStore', {
  state: () => ({
    publicWorkouts: [],
    savedWorkouts: [],
    loading: false
  }),
  actions: {
    async getToken() {
      const user = auth.currentUser;
      if (!user) throw new Error("Utilizator nelogat");
      return await user.getIdToken();
    },
    async fetchPublicWorkouts() {
      this.loading = true;
      const res = await fetch('http://localhost:3000/api/workouts/public', {
        headers: { 'Authorization': `Bearer ${await this.getToken()}` }
      });
      this.publicWorkouts = await res.json();
      this.loading = false;
    },
    async fetchSavedWorkouts() {
      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/workouts/saved', {
          headers: { 'Authorization': `Bearer ${await this.getToken()}` }
        });
        this.savedWorkouts = await res.json();
      } finally {
        this.loading = false;
      }
    },
    async saveToMyProfile(workoutId) {
      const res = await fetch('http://localhost:3000/api/workouts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await this.getToken()}` },
        body: JSON.stringify({ workoutId })
      });
      if (res.ok) await this.fetchSavedWorkouts();
      else alert((await res.json()).error);
    },
    async removeFromSaved(workoutId) {
      const res = await fetch(`http://localhost:3000/api/workouts/saved/${workoutId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${await this.getToken()}` }
      });
      if (res.ok) await this.fetchSavedWorkouts();
    },
  

  async createNewWorkout(workoutData) {
  this.loading = true;
  try {
    const token = await this.getToken();
    const res = await fetch('http://localhost:3000/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(workoutData)
    });

    if (res.ok) {
      const newWorkout = await res.json();
      
      await this.saveToMyProfile(newWorkout.id); 
      
      await this.fetchPublicWorkouts();
    }
  } catch (err) {
    console.error("Eroare la creare și salvare:", err);
  } finally {
    this.loading = false;
  }
},

async deleteWorkoutPermanently(workoutId) {
  if (!confirm("ATENȚIE: Această acțiune va șterge antrenamentul DEFINITIV din biblioteca globală. Continuăm?")) return;

  try {
    const token = await this.getToken();
    const res = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      await this.fetchPublicWorkouts();
      await this.fetchSavedWorkouts();
      alert("Antrenamentul a fost eliminat de peste tot.");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  } catch (err) {
    console.error("Eroare la ștergerea definitivă:", err);
  }
},

async updateWorkout(id, updatedData) {
  try {
    const token = await this.getToken();
    const res = await fetch(`http://localhost:3000/api/workouts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      await this.fetchPublicWorkouts();
      await this.fetchSavedWorkouts();
      return true;
    } else {
      const err = await res.json();
      alert(err.error);
      return false;
    }
  } catch (err) {
    console.error("Eroare la editare:", err);
  }
}
  }
});