import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDCvlTzinpLCUUlJNDaJY4-jvjJTlIXrzs",
  authDomain: "meu-forum-app-firebase.firebaseapp.com",
  projectId: "meu-forum-app-firebase",
  storageBucket: "meu-forum-app-firebase.appspot.com",
  messagingSenderId: "626189175262",
  appId: "1:626189175262:web:f4fca5c39cb05d7d01b54f",
  measurementId: "G-9PD0L7ST4V"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app };