// ============================================================
//  firebase-messaging-sw.js — Room Portal (Gnanesh's Place)
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey:            "AIzaSyDTvdt-xueov5P-RxD7kl4n3FtlwYrQ1Qw",
  authDomain:        "homies-f3af3.firebaseapp.com",
  projectId:         "homies-f3af3",
  storageBucket:     "homies-f3af3.firebasestorage.app",
  messagingSenderId: "274559235191",
  appId:             "1:274559235191:web:cab73238629e2f05884272"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);
  const title   = payload.notification?.title || '🏠 Room Portal';
  const options = {
    body:    payload.notification?.body || 'New update from Room Portal',
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

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/Homies');
      }
    })
  );
});

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
