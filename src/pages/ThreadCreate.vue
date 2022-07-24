<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>

<script>
import ThreadEditor from "../components/ThreadEditor.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";
import { findById } from "@/helpers";

export default {
  components: {
    ThreadEditor,
  },
  mixins: [asyncDataStatus],
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  data() {
    return { formIsDirty: false };
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums, this.forumId);
    },
  },
  methods: {
    async save({ title, text }) {
      const thread = await this.$store.dispatch("createThread", {
        forumId: this.forum.id,
        title,
        text,
      });
      //Save thread to the forums
      this.$router.push({ name: "Thread", params: { id: thread.id } });
    },
    cancel() {
      this.$router.push({ name: "Forum", params: { id: this.forum.id } });
    },
  },
  async created() {
    await this.$store.dispatch("fetchForum", { id: this.forumId });
    this.asyncDataStatus_fetched();
  },
  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        "Are you sure you wish to leave? All unsaved changes will be lost.",
      );
      if (!confirmed) return false;
    }
  },
};
</script>

<style></style>
