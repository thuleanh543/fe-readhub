import { useEffect, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../config/firebase';

const useFCM = () => {
  const [fcmToken, setFcmToken] = useState(localStorage.getItem('fcmToken'));

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Kiểm tra token đã tồn tại và chưa hết hạn
        if (!fcmToken) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const token = await getToken(messaging, {
              vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
            });

            if (token) {
              const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notifications/register-device`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ fcmToken: token })
              });

              if (response.ok) {
                localStorage.setItem('fcmToken', token);
                setFcmToken(token);
              }
            }
          }
        }
      } catch (error) {
        console.error('FCM initialization error:', error);
      }
    };

    // Chỉ khởi tạo khi người dùng đã đăng nhập
    if (localStorage.getItem('token')) {
      initializeFCM();
    }
  }, [fcmToken]);

  return fcmToken;
};

export default useFCM;