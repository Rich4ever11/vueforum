<template>
  <the-navbar />
  <div class="container">
    <router-view
      v-show="showPage"
      @ready="onPageReady"
      :key="`${$route.path}${JSON.stringify($route.query)}`"
    />
    <AppSpinner v-show="!showPage" />
  </div>
  <AppNotifications />
</template>

<script>
import AppNotifications from "./components/AppNotifications.vue";
import TheNavbar from "@/components/TheNavBar";
import { mapActions } from "vuex";
import NProgress from "nprogress";
export default {
  name: "App",
  components: { TheNavbar, AppNotifications },
  data() {
    return {
      showPage: false,
    };
  },
  methods: {
    ...mapActions(["fetchAuthUser"]),
    onPageReady() {
      this.showPage = true;
      NProgress.done();
    },
  },
  created() {
    this.fetchAuthUser();
    NProgress.configure({
      speed: 200,
      showSpinner: false,
    });
    this.$router.beforeEach(() => {
      this.showPage = false;
      NProgress.start();
    });
  },
};
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
#nprogress .bar {
  background: #57ad8d !important;
}
</style>
