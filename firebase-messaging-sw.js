// ============================================================
//  firebase-messaging-sw.js
//  Place this file in the ROOT of your GitHub Pages repo
//  (same folder as index.html)
// ============================================================

// ── STEP: Replace these with YOUR Firebase config values ──
const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_WITH_YOUR_apiKey",
  authDomain:        "REPLACE_WITH_YOUR_authDomain",
  projectId:         "REPLACE_WITH_YOUR_projectId",
  storageBucket:     "REPLACE_WITH_YOUR_storageBucket",
  messagingSenderId: "REPLACE_WITH_YOUR_messagingSenderId",
  appId:             "REPLACE_WITH_YOUR_appId"
};

// Import Firebase scripts (use compat version for service workers)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);

  const title   = payload.notification?.title || '🏠 Room Portal';
  const options = {
    body:    payload.notification?.body  || 'New update from Room Portal',
    icon:    '/icons/icon-192.png',
    badge:   '/icons/icon-72.png',
    tag:     'room-portal-notification',
    vibrate: [200, 100, 200],
    data:    payload.data || {},
    actions: [
      { action: 'open',    title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss'  }
    ]
  };

  self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'dismiss') return;

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Basic service worker lifecycle
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
