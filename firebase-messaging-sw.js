// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker with web credentials
firebase.initializeApp({
  apiKey: "AIzaSyAB9jgdlM6YWtyNOmSjQOalnQygaOh-jjU",
  authDomain: "zlash-buyer.firebaseapp.com",
  projectId: "zlash-buyer",
  storageBucket: "zlash-buyer.firebasestorage.app",
  messagingSenderId: "426806393721",
  appId: "1:426806393721:web:fd37e54a1b07bcc44b0da8",
  measurementId: "G-30Q19N34YV"
});

const messaging = firebase.messaging();

// Background push handler when the browser tab is not focused/closed
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const title = payload.notification?.title || payload.data?.title || "New Notification";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/icons/Icon-192.png",
    badge: "/icons/Icon-192.png",
    tag: "pos-bg-notification-" + Date.now(),
    renotify: true,
    requireInteraction: true,
    data: payload.data || {}
  };

  return self.registration.showNotification(title, options);
});

// Focus or open the app window on clicking the notification banner
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
