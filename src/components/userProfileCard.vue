<template>
  <div class="profile-card">
    <p class="text-center">
      <AppAvatarImg :src="user.avatar" :alt="` ${user.name} profile picture`" />
    </p>

    <h1 class="title">{{ user.username }}</h1>

    <p class="text-lead">{{ user.name }}</p>

    <p class="text-justify">{{ user.bio }}</p>

    <span class="online">{{ user.username }} is online</span>

    <div class="stats">
      <span
        >{{
          user.postsCount === 1
            ? user.postsCount + " post"
            : user.postsCount + " posts"
        }}
      </span>
      <span>{{
        user.threadsCount === 1
          ? user.threadsCount + " thread"
          : user.threadsCount + " threads"
      }}</span>
    </div>

    <hr />

    <p v-if="user.website" class="text-large text-center">
      <i class="fa fa-global"></i>
      <a href="user.website">{{ user.website }}</a>
    </p>
  </div>
  <div class="text-center">
    <router-link :to="{ name: 'ProfileEdit' }" class="btn-green btn-small"
      >Edit Profile</router-link
    >
  </div>
</template>

<script>
export default {
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  computed: {
    userPosts() {
      return this.$store.state.posts.filter(
        (post) => post.userId === this.user.id,
      );
    },
    userPostsCount() {
      return this.userPosts.length;
    },
    userThreads() {
      return this.$store.state.threads.filter(
        (thread) => thread.userId === this.user.id,
      );
    },
    userThreadsCount() {
      return this.userThreads.length;
    },
  },
};
</script>

<style scoped></style>
