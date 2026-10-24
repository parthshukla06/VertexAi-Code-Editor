import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vertex-ai-cfe45.firebaseapp.com",
  projectId: "vertex-ai-cfe45",
  storageBucket: "vertex-ai-cfe45.firebasestorage.app",
  messagingSenderId: "985980548598",
  appId: "1:985980548598:web:a147c12a04c9c3d5cb83d7",
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "VITE_FIREBASE_API_KEY is missing. Check frontend/.env and restart Vite."
  );
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();