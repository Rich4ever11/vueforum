<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1>{{ category.name }}</h1>
    <ForumList :title="category.name" :forums="getCategoryForums(category)" />
  </div>
</template>

<script>
import ForumList from "@/components/ForumList.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  components: {
    ForumList,
  },
  mixins: [asyncDataStatus],
  props: {
    id: { required: true, type: String },
  },
  computed: {
    category() {
      return (
        this.$store.state.categories.find(
          (category) => category.id === this.id,
        ) || {}
      );
    },
  },
  methods: {
    getCategoryForums(category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id,
      );
    },
  },
  async created() {
    const category = await this.$store.dispatch("fetchCategory", {
      id: this.id,
    });
    await this.$store.dispatch("fetchForums", { ids: category.forums });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
