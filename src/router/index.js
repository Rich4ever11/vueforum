import store from "@/store";

import Home from "@/pages/Home.vue";
import Thread from "@/pages/Thread.vue";
import ThreadCreate from "@/pages/ThreadCreate.vue";
import ThreadEdit from "@/pages/ThreadEdit.vue";
import Forum from "@/pages/Forum.vue";
import Category from "@/pages/Category.vue";
import Profile from "@/pages/Profile.vue";
import Register from "@/pages/Register.vue";
import Login from "@/pages/Login.vue";
import NotFound from "@/pages/NotFound.vue";

import { createRouter, createWebHistory } from "vue-router";
import { findById } from "@/helpers";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    props: true,
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    props: true,
    meta: { requiresGuest: true },
  },
  {
    path: "/logout",
    name: "Logout",
    async beforeEnter() {
      await store.dispatch("signOut");
      return { name: "Home" };
    },
  },
  {
    path: "/thread/:id",
    name: "Thread",
    component: () => import(/* webpackChunkName: "Thread" */ "@/pages/Thread"),
    props: true,
    async beforeEnter(to, from, next) {
      await store.dispatch("fetchThread", { id: to.params.id, once: true });
      // check if thread exists
      const threadExists = findById(store.state.threads, to.params.id);
      // if exists continue
      if (threadExists) {
        return next();
      } else {
        next({
          name: "NotFound",
          params: { pathMatch: to.path.substring(1).split("/") },
        });
      }
      // if doesnt exist redirect to not found
    },
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    component: ThreadCreate,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/forum/:id?",
    name: "Forum",
    component: () => import(/* webpackChunkName: "Forum" */ "@/pages/Forum"),
    props: true,
  },
  {
    path: "/category/:id",
    name: "Category",
    component: Category,
    props: true,
  },
  {
    path: "/me",
    name: "Profile",
    component: Profile,
    props: true,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true },
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});

router.afterEach(() => {
  store.dispatch("clearItems", {
    modules: ["categories", "forums", "threads", "posts"],
  });
});

router.beforeEach(async (to, from) => {
  await store.dispatch("initAuthentication");
  store.dispatch("unsubscribeAllSnapshots");
  if (to.meta.requiresAuth && !store.state.authId) {
    return { name: "Login", query: { redirectTo: to.path } };
  }
  if (to.meta.requiresGuest && store.state.authId) {
    return { name: "Home" };
  }
});

export default router;
