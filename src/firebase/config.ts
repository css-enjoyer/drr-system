import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products to be used

const firebaseConfig = {
    apiKey: "AIzaSyC948B9d6ilrIelZD0tiIEWxjWlZw8i8Fs",
    authDomain: "drr-system.firebaseapp.com",
    projectId: "drr-system",
    storageBucket: "drr-system.appspot.com",
    messagingSenderId: "350863319556",
    appId: "1:350863319556:web:72eb2b16177346d2454b51",
    measurementId: "G-3D580LH65K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);