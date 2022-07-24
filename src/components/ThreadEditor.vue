<template>
  <VeeForm @submit="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <VeeField
        name="title"
        label="Title"
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        :rules="{ required: true }"
      />
      <VeeErrorMessage name="title" class="form-error" />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <VeeField
        name="content"
        label="Content"
        v-model="form.text"
        type="text"
        id="thread_content"
        class="form_input"
        rows="8"
        cols="140"
        as="textarea"
      />
      <VeeErrorMessage name="content" class="form-error" />
    </div>

    <div class="btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn-ghost">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="publish">
        {{ existing ? "Update" : "Publish" }}
      </button>
    </div>
  </VeeForm>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: this.title,
        text: this.text,
      },
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
  computed: {
    existing() {
      return !!this.title;
    },
  },
  methods: {
    save() {
      this.$emit("clean");
      this.$emit("save", { ...this.form });
    },
  },
  watch: {
    form: {
      handle() {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit("dirty");
        } else {
          this.$emit("clean");
        }
      },
      deep: true,
    },
  },
};
</script>

<style></style>
