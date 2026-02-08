// Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyCrjr-Yfk60UqFpkHvSD2okzvvC9S7u0SA",
  authDomain: "hyperframex.firebaseapp.com",
  projectId: "hyperframex",
  storageBucket: "hyperframex.firebasestorage.app",
  messagingSenderId: "822005110518",
  appId: "1:822005110518:web:63e23927445d18473bbed7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);
