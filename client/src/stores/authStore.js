import { defineStore } from 'pinia';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged} from 'firebase/auth';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    loading: false
  }),
  actions: {
    async registerUser(email, password) {
      this.loading = true;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        alert("Cont creat cu succes! Bine ai venit!");
        return true;
      } catch (error) {
        let message = "Eroare la înregistrare";
        if (error.code === 'auth/email-already-in-use') message = "Emailul este deja folosit.";
        if (error.code === 'auth/weak-password') message = "Parola este prea slabă.";
        alert(message);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async loginUser(email, password) {
      this.loading = true;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        return true;
      } catch (error) {
        alert("Email sau parolă incorectă.");
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});