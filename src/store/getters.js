import { findById } from "@/helpers";

export default {
  user(state) {
    return (id) => {
      const user = findById(state.users, id);
      if (!user) {
        return null;
      } else {
        return {
          ...user,
          //authUser.posts
          get posts() {
            return state.posts.filter((post) => post.userId === user.id);
          },
          //authUser.postsCount
          get postsCount() {
            return user.postsCount || 0;
          },
          //authUser.threads
          get threads() {
            return state.threads.filter((thread) => thread.userId === user.id);
          },
          //authUser.threadsCount
          get threadsCount() {
            return user.threads?.length || 0;
          },
        };
      }
    };
  },
  authUser(state, getters) {
    return getters.user(state.authId);
  },
  thread(state) {
    return (id) => {
      const thread = findById(state.threads, id);
      if (!thread) return {};
      return {
        ...thread,
        get author() {
          return findById(state.users, thread.userId);
        },
        get replies() {
          return thread.posts.length - 1;
        },
        get contributors() {
          if (!thread.contributors) return 0;
          return thread.contributors?.length;
        },
      };
    };
  },
};
