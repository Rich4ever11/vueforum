<template>
  <VueFinalModal
    v-model="showModal"
    classes="modal-container"
    content-class="modal"
  >
    <div class="modal-content">
      <h4>Login To Change Your Email</h4>
      <VeeForm @submit="reauthenticate">
        <div class="form-group">
          <label for="reauth-email">Email</label>
          <VeeField
            name="reauth-email"
            label="Email"
            v-model="email"
            id="email"
            type="email"
            class="form-input"
            :rules="{
              required: true,
              email: true,
            }"
          />
          <VeeErrorMessage name="reauth-email" class="form-error" />
        </div>

        <div class="form-group">
          <label for="reauth-password">Password</label>
          <VeeField
            name="reauth-password"
            label="Password"
            v-model="password"
            id="password"
            type="password"
            class="form-input"
            :rules="{ required: true }"
          />
          <VeeErrorMessage name="reauth-password" class="form-error" />
        </div>
        <button class="btn btn-green btn-small">Login</button>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from "vue-final-modal";

export default {
  components: {
    VueFinalModal,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    showModal: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    async reauthenticate() {
      try {
        await this.$store.dispatch("reauthenticate", {
          email: this.email,
          password: this.password,
        });
        this.$emit("success");
      } catch (error) {
        this.$emit("failed", error);
      }
    },
  },
};
</script>
