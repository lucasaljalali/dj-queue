import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBSzirHg4Hzlu5CdOzUoCLE3Cg7RRnh8nc",
  authDomain: "dj-queue-32151.firebaseapp.com",
  projectId: "dj-queue-32151",
  storageBucket: "dj-queue-32151.appspot.com",
  messagingSenderId: "731896116135",
  appId: "1:731896116135:web:059a2ea4eeaf15aa1d7c82",
  measurementId: "G-S256MP6WKF",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
