// lib/firebase/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

export const firebaseConfig = {
    apiKey: "AIzaSyB3hF_lpXqc3xKkvLr79KU5dOqejXr36KE",
    authDomain: "letransporteur-18b0d.firebaseapp.com",
    projectId: "letransporteur-18b0d",
    storageBucket: "letransporteur-18b0d.firebasestorage.app",
    messagingSenderId: "599301733986",
    appId: "1:599301733986:web:a1ec6a3afa6c1ff98f5b3b",
    measurementId: "G-G81QDBB7RN",
    vapidKey: "BIYq90ZGJbAB85pPONy3dwJrpKE_-dz_-b7KpkO0Ywgywr0ceMo8UPFKiylbSIvXtatKIP3uT995SuEvPzjMlmM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
// Only initialize if messaging is supported
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            messaging = getMessaging(app);
        }
    });
}

export { app, messaging };
