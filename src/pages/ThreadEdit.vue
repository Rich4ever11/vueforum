<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div v-if="thread && text" class="col-full push-top">
      <h1>
        Editing: <i>{{ thread.title }}</i>
      </h1>

      <ThreadEditor
        :title="thread.title"
        :text="text"
        @save="save"
        @cancel="cancel"
      />
    </div>
  </div>
</template>

<script>
import ThreadEditor from "../components/ThreadEditor.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  components: {
    ThreadEditor,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  mixins: [asyncDataStatus],

  computed: {
    thread() {
      const thread = this.$store.state.threads.find(
        (thread) => thread.id === this.id,
      );
      return thread;
    },
    text() {
      const post = this.$store.state.posts.find(
        (post) => post.id === this.thread.posts[0],
      );
      return post ? post.text : "";
    },
  },
  methods: {
    async save({ title, text }) {
      const thread = await this.$store.dispatch("updateThread", {
        id: this.id,
        title,
        text,
      });
      //Save thread to the forums
      this.$router.push({ name: "Thread", params: { id: thread.id } });
    },
    cancel() {
      this.$router.push({ name: "Thread", params: { id: this.id } });
    },
  },
  async created() {
    const thread = await this.$store.dispatch("fetchThread", { id: this.id });
    await this.$store.dispatch("fetchPost", { id: thread.posts[0] });
    this.asyncDataStatus_fetched();
  },
  //Implement a warning when the user leaves the page
};
</script>

<style></style>
