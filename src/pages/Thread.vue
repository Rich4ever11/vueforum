<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}

      <router-link
        v-if="thread.userId === authUser?.id"
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
      >
        {{
          thread.replies === 1
            ? thread.replies + " reply"
            : thread.replies + " replies"
        }}
        by
        {{
          thread.contributors === 1
            ? thread.contributors + " contributor"
            : thread.contributors + " contributors"
        }}
      </span>
    </p>

    <post-list :posts="threadPosts" />
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'Login', query: { redirectTo: $route.path } }"
        >Login</router-link
      >
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: $route.path } }"
        >Register</router-link
      >
      to reply.
    </div>
  </div>
  <div v-else class="col-full text-center">
    <h1>This thread does not exist</h1>
    <router-link :to="{ name: 'Home' }">Go back to Vue Forum</router-link>
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";
import useNotification from "@/composables/useNotifications";
import difference from "lodash/difference";
import { mapGetters } from "vuex";

export default {
  name: "Thread",
  components: {
    PostList,
    PostEditor,
  },
  mixins: [asyncDataStatus],
  setup() {
    const { addNotification } = useNotification();
    return { addNotification };
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapGetters(["authUser"]),
    threads() {
      return this.$store.state.threads;
    },
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      return this.$store.getters.thread(this.id);
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  methods: {
    async fetchPostsWithUsers(ids) {
      // fetch the posts
      const posts = await this.$store.dispatch("fetchPosts", {
        ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          if (
            !this.asyncDataStatus_ready ||
            isLocal ||
            (previousItem?.edited && !previousItem?.edited?.at)
          )
            return;
          this.addNotification({
            message: "Thread recently updated",
            timeout: 5000,
          });
        },
      });
      // fetch the users associated with the posts
      const users = posts.map((post) => post.userId).concat(this.thread.userId);
      await this.$store.dispatch("fetchUsers", { ids: users });
    },
    addPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.$store.dispatch("createPost", post);
    },
  },
  async fetchPostWithUsers(ids) {
    //Fetch the list of posts
    const posts = await this.$store.dispatch("fetchPosts", {
      ids: ids,
    });
    //fetch the list of users associated with the posts
    const users = posts.map((post) => post.userId).concat(this.thread.userId);
    await this.$store.dispatch("fetchUsers", { ids: users });
  },
  async created() {
    //Fetch the thread
    const thread = await this.$store.dispatch("fetchThread", {
      id: this.id,
      onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return;
        const newPosts = difference(item.posts, previousItem.posts);
        const hasNewPosts = newPosts.length > 0;
        if (hasNewPosts) {
          await this.fetchPostsWithUsers(newPosts);
        } else {
          this.addNotification({
            message: "Thread recently updated",
            timeout: 5000,
          });
        }
      },
    });
    await this.fetchPostsWithUsers(thread.posts);
    this.asyncDataStatus_fetched();
  },
};
//http://localhost:8080/thread/-KsjWehQ--apjDBwSBCY
</script>

<style scoped></style>
