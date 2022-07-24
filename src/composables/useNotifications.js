import { reactive } from "vue";
const notifications = reactive([]);

const addNotification = ({ message, timeout = null, type = "info" }) => {
  const notificationId = Math.random() + Date.now();
  notifications.push({
    id: notificationId,
    message: message,
    type: type,
  });
  if (timeout) {
    setTimeout(() => {
      removeNotification(notificationId);
    }, timeout);
  }
};

const removeNotification = (id) => {
  const index = notifications.findIndex((item) => item.id === id);
  notifications.splice(index, 1);
};

export default function useNotification() {
  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
