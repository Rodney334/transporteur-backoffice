// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyB3hF_lpXqc3xKkvLr79KU5dOqejXr36KE",
    authDomain: "letransporteur-18b0d.firebaseapp.com",
    projectId: "letransporteur-18b0d",
    storageBucket: "letransporteur-18b0d.firebasestorage.app",
    messagingSenderId: "599301733986",
    appId: "1:599301733986:web:a1ec6a3afa6c1ff98f5b3b",
    measurementId: "G-G81QDBB7RN"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Nouvelle notification';
    const notificationOptions = {
        body: payload.notification?.body || 'Vous avez une nouvelle notification',
        icon: '/icon-192x192.png', // Update with your app icon path
        badge: '/badge-72x72.png', // Update with your badge icon path
        data: payload.data,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);
    event.notification.close();

    // Navigate to the app when notification is clicked
    event.waitUntil(
        clients.openWindow('/')
    );
});
