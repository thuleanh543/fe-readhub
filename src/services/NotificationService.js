import { getDatabase, ref, onChildAdded } from "firebase/database";
import { toast } from "react-toastify";

export const NotificationService = {
  subscribeToNotifications: (userId) => {
    const db = getDatabase();
    const notificationsRef = ref(db, `notifications/${userId}`);

    onChildAdded(notificationsRef, (snapshot) => {
      const notification = snapshot.val();
      toast.info(notification.message, {
        position: "top-right",
        autoClose: 5000
      });
    });
  }
}