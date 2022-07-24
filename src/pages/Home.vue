<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="col-full text-center push-top">Welcome to the Vue Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<!--Javascript Being run insIde the vue file-->
<script>
import CategoryList from "@/components/CategoryList.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";
export default {
  mixins: [asyncDataStatus],
  components: {
    CategoryList,
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
  },
  async created() {
    const categories = await this.$store.dispatch("fetchAllCategories");
    const forumIds = categories.map((category) => category.forums).flat();
    await this.$store.dispatch("fetchForums", { ids: forumIds });
    this.asyncDataStatus_fetched();
  },
};
</script>

<!-- CSS style for the webpage-->
<style scoped></style>
