import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import { findById } from "@/helpers";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "@/pages/Home"),
    props: true,
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "Register" */ "@/pages/Register"),
    props: true,
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ "@/pages/Login"),
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
    component: () =>
      import(/* webpackChunkName: "ThreadCreate" */ "@/pages/ThreadCreate"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: () =>
      import(/* webpackChunkName: "ThreadEdit" */ "@/pages/ThreadEdit"),
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
    component: () =>
      import(/* webpackChunkName: "Category" */ "@/pages/Category"),
    props: true,
  },
  {
    path: "/me",
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "Profile" */ "@/pages/Profile"),
    props: true,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true },
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: () =>
      import(/* webpackChunkName: "Profile" */ "@/pages/Profile"),
    props: { edit: true },
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "@/pages/NotFound"),
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

router.beforeEach(async (to) => {
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
