import { getDatabase, ref, onChildAdded } from "firebase/database";
import { toast } from "react-toastify";
import { database } from '../config/firebase';

export const NotificationService = {
  subscribeToNotifications: (userId) => {
    const notificationsRef = ref(database, `notifications/${userId}`);

    onChildAdded(notificationsRef, (snapshot) => {
      const notification = snapshot.val();
      toast.info(notification.message, {
        position: "top-right",
        autoClose: 5000
      });
    });
  }
};