// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyNUpxvz6g1Qk6Ev-Ku_Uk44zCmuBHUs8",
    authDomain: "workout-tracking-39e60.firebaseapp.com",
    projectId: "workout-tracking-39e60",
    storageBucket: "workout-tracking-39e60.firebasestorage.app",
    messagingSenderId: "697859416372",
    appId: "1:697859416372:web:d11e32eb5f099d2ee04561",
    measurementId: "G-JXLB1QEEGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
// Enable persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
});

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Error signing in", error);
    }
};

export const logout = async () => {
    await signOut(auth);
};
