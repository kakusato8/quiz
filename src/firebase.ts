import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAKL0TY26Z54Mdk5cS9kraIkvBnP6KumnM",
  authDomain: "quiz-e08fc.firebaseapp.com",
  projectId: "quiz-e08fc",
  storageBucket: "quiz-e08fc.firebasestorage.app",
  messagingSenderId: "1079346785407",
  appId: "1:1079346785407:web:6b788c5fb0361184c3234a",
  measurementId: "G-R856RK1LMB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);