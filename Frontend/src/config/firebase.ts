import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDY1JTmzqC4y3onDBNxWqcc2Ld5gmub8oE",
  authDomain: "fir-01-8f643.firebaseapp.com",
  projectId: "fir-01-8f643",
  storageBucket: "fir-01-8f643.firebasestorage.app",
  messagingSenderId: "715244062056",
  appId: "1:715244062056:web:047b91f4a2d8c5283b82dd",
  measurementId: "G-1KT99FWY7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;