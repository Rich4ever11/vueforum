<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :class="`notification-type-${notification.type}`"
        :key="notification.id"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">X</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import useNotification from "@/composables/useNotifications";
export default {
  setup() {
    const { notifications, removeNotification } = useNotification();
    return { notifications, removeNotification };
  },
};
</script>

<style scoped>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
}
.notification.notification-type-error {
  border-left: 5px solid rgb(146, 5, 5);
}
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-move {
  transition: transform 0.8s ease;
}
</style>
