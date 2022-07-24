<template>
  <div class="col-full">
    <VeeForm @submit="save" :key="formKey">
      <div class="form-group">
        <VeeField
          name="text"
          label="Text"
          cols="30"
          rows="10"
          class="form-input"
          v-model="postCopy.text"
          as="textarea"
          :rules="{
            required: true,
          }"
        />
        <VeeErrorMessage name="text" class="form-error" />
      </div>
      <div class="form-action">
        <button class="btn-blue">
          {{ post.id ? "Update Post" : "Submit Post" }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => ({ text: null }) },
  },
  data() {
    return {
      text: "",
      postCopy: { ...this.post },
      formKey: Math.random(),
    };
  },
  methods: {
    save() {
      this.$emit("save", { post: this.postCopy }); //Access under eventData.post
      this.postCopy.text = "";
      this.formKey = Math.random();
    },
  },
};
</script>

<style scoped></style>
