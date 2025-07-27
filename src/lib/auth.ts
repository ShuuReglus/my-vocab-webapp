// auth.ts
import { getAuth } from 'firebase/auth';
import app from './firebase'; // firebase.ts で `initializeApp()` してるやつ

export const auth = getAuth(app);
