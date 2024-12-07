self.addEventListener('install', function(event) {
});

self.addEventListener('activate', function(event) {
});

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBbG_PGTHFdZXVlRDJWBWp5P6r1SaLGgrE",
  authDomain: "readhub-f25b0.firebaseapp.com",
  projectId: "readhub-f25b0",
  storageBucket: "readhub-f25b0.appspot.com",
  messagingSenderId: "585734991024",
  appId: "1:585734991024:web:8d0ea1613ba55e323d0055"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  return self.registration.showNotification(payload.notification.title, notificationOptions);
});