import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyrC1S8pwDBHDDN8xQlttqVRv4T-eWnU4",
  authDomain: "fity-500005.firebaseapp.com",
  projectId: "fity-500005",
  storageBucket: "fity-500005.firebasestorage.app",
  messagingSenderId: "119520094804",
  appId: "1:119520094804:web:5a2a7577946dc599e9dbc1",
  measurementId: "G-8PNLZ8NJGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  display: 'popup'
});
// Only request public_profile for now. Add 'email' after enabling it in Facebook Developer Console.
facebookProvider.addScope('public_profile');
