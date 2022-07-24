import { createApp } from "vue";
import App from "./App.vue";
import firebase from "@/helpers/firebase";
import firebaseConfig from "@/config/firebase";
import fontAwesome from "@/plugins/fontAwesome.js";
import ClickOutsideDirective from "@/plugins/ClickOutsideDirective.js";
import PageScrollDirective from "@/plugins/PageScrollDirective.js";
import Vue3Pagination from "./plugins/Vue3Pagination";
import VeeValidatePlugin from "./plugins/VeeValidatePlugin";

import router from "@/router";
import store from "@/store";

// Initialize Firebase
const initFirebase = firebase.initializeApp(firebaseConfig);

const forumApp = createApp(App);
forumApp.use(router);
forumApp.use(store);
forumApp.use(initFirebase);
forumApp.use(fontAwesome);
forumApp.use(ClickOutsideDirective);
forumApp.use(PageScrollDirective);
forumApp.use(Vue3Pagination);
forumApp.use(VeeValidatePlugin);

const requireComponent = require.context(
  "./components",
  true,
  /App[A-Z]\w+\.(vue|js)$/,
);
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName =
    baseComponentConfig.name ||
    fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");
  forumApp.component(baseComponentName, baseComponentConfig);
});

forumApp.mount("#app");
