import { NextResponse } from 'next/server';
// if (payload.notification) {
//         console.log('[firebase-messaging-sw.js] Payload has a notification, skipping manual display to avoid duplication.');
//         return;
//     }
export async function GET() {
  const swCode = `// Firebase Cloud Messaging Service Worker (Dynamic)
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
    authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}",
    measurementId: "${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.data?.title || 'Nouvelle notification';
    const notificationOptions = {
        body: payload.data?.body || 'Vous avez une nouvelle notification',
        icon: '/icon.png',
        badge: '/badge-72x72.png',
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
        clients.openWindow('/notification-redirect')
    );
});
`;

  return new NextResponse(swCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
