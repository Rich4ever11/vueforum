<template>
  <forum-list
    v-for="category in categories"
    :key="category.id"
    :forums="getCategoryForums(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<script>
import ForumList from "@/components/ForumList";

export default {
  components: { ForumList },
  props: {
    categories: {
      required: true,
      type: Array,
    },
  },
  methods: {
    getCategoryForums(category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id,
      );
    },
  },
};
</script>

<style></style>
