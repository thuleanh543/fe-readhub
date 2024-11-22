import { useEffect, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../config/firebase';

const useFCM = () => {

  useEffect(() => {
    const initializeNotifications = async () => {
      try {

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Get FCM token
          const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
          });

          if (token) {

            await fetch(`${process.env.REACT_APP_API_BASE_URL}/notifications/register-device`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ fcmToken: token })
            });
            console.log('FCM token:', token);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      } finally {
      }
    };

    initializeNotifications();
  }, []);
};

export default useFCM;