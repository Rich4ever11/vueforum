<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <VeeField
            name="name"
            label="Name"
            v-model="form.name"
            id="name"
            type="text"
            class="form-input"
            :rules="{
              required: true,
            }"
          />
          <VeeErrorMessage name="name" class="form-error" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <VeeField
            name="username"
            label="Username"
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
            :rules="{
              required: true,
              unique: { collection: 'users', field: 'username' },
            }"
          />
          <VeeErrorMessage name="username" class="form-error" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <VeeField
            name="email"
            label="Email"
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
            :rules="{
              required: true,
              email: true,
              unique: { collection: 'users', field: 'email' },
            }"
          />
          <VeeErrorMessage name="email" class="form-error" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <VeeField
            name="password"
            label="Password"
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
            :rules="{ required: true, min: 8 }"
          />
          <VeeErrorMessage name="password" class="form-error" />
        </div>

        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" />
            </div>
          </label>
          <VeeField
            name="avatar"
            v-show="!avatarPreview"
            id="avatar"
            type="file"
            accept="image/*"
            class="form-input"
            @change="handleImageUpload"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button @click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      avatarPreview: null,
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        avatar: "",
      },
    };
  },
  methods: {
    async register() {
      await this.$store.dispatch("registerUserWithEmailAndPassword", this.form);
      this.$router.push("/");
    },
    async registerWithGoogle() {
      await this.$store.dispatch("signInWithGoogle");
      this.$router.push("/");
    },
    handleImageUpload(handleEvent) {
      this.form.avatar = handleEvent.target.files[0];
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.avatarPreview = readerEvent.target.result;
      };
      reader.readAsDataURL(this.form.avatar);
    },
  },
  created() {
    this.$emit("ready");
  },
};
</script>
