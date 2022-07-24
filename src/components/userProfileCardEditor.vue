<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${user.name} profile name`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" :color="white" />
            <fa
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opacity: '.8' }"
            />
          </div>

          <input
            v-show="false"
            type="file"
            id="avatar"
            accept="image/*"
            @change="handleAvatarUpload"
          />
        </label>
      </p>

      <div class="form-group">
        <VeeField
          name="username"
          label="Username"
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
          :rules="{
            required: true,
            unique: {
              collection: 'users',
              field: 'username',
              currentValue: `${user.username}`,
            },
          }"
        />
        <VeeErrorMessage name="username" class="form-error" />
      </div>

      <div class="form-group">
        <VeeField
          name="name"
          label="Name"
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
          :rules="{
            required: true,
          }"
        />
        <VeeErrorMessage name="name" class="form-error" />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <VeeField
          name="bio"
          label="Bio"
          v-model="activeUser.bio"
          class="form-input"
          id="user_bio"
          placeholder="write a few words about yourself"
          as="textarea"
        />
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <VeeField
          name="website"
          label="Website"
          v-model="activeUser.website"
          id="user_website"
          class="form-input"
          autocomplete="off"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <VeeField
          name="email"
          label="Email"
          v-model="activeUser.email"
          id="user_email"
          class="form-input"
          autocomplete="off"
          :rules="{
            required: true,
            email: true,
            unique: {
              collection: 'users',
              field: 'email',
              currentValue: `${user.email}`,
            },
          }"
        />
        <VeeErrorMessage name="email" class="form-error" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <VeeField
          name="location"
          label="Location"
          v-model="activeUser.location"
          id="user_location"
          class="form-input"
          autocomplete="off"
          list="locations"
          @mouseenter="loadLocationOptions"
        />
        <datalist id="locations">
          <option
            v-for="location in locationOptions"
            :value="location.name.common"
            :key="location.name.common"
          ></option>
        </datalist>
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
    <userProfileCardEditorReauthenticate
      v-model="needsReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<script>
import userProfileCardEditorReauthenticate from "@/components/userProfileCardEditorReauthenticate.vue";
import useNotifications from "@/composables/useNotifications";

export default {
  components: {
    userProfileCardEditorReauthenticate,
  },
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  setup() {
    const { addNotification } = useNotifications();
    return { addNotification };
  },
  data() {
    return {
      activeUser: { ...this.user },
      uploadingImage: false,
      locationOptions: [],
      needsReAuth: false,
    };
  },
  methods: {
    async loadLocationOptions() {
      if (this.locationOptions.length) return;
      const res = await fetch("https://restcountries.com/v3/all");
      this.locationOptions = await res.json();
    },
    async handleAvatarUpload(event) {
      this.uploadingImage = true;
      const file = event.target.files[0];
      const uploadedImage = await this.$store.dispatch("uploadAvatar", {
        file,
      });
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
      this.uploadingImage = false;
    },
    async onReauthenticated() {
      await this.$store.dispatch("updateEmail", {
        email: this.activeUser.email,
      });
      this.saveUserData();
    },
    async onReauthenticatedFailed() {
      this.addNotification({
        message: "Error updating user",
        type: "error",
        timeout: 3000,
      });
      this.$router.push({ name: "Profile" });
    },
    async saveUserData() {
      await this.$store.dispatch("updateUser", {
        ...this.activeUser,
        threads: this.activeUser.threadIds,
      });
      this.$router.push({ name: "Profile" });
      this.addNotification({
        message: "User successfully updated",
        timeout: 3000,
      });
    },
    async save() {
      await this.$store.dispatch("updateUser", {
        ...this.activeUser,
        threads: this.activeUser.threadIds,
      });
      await this.$store.dispatch("updateEmail", {
        email: this.activeUser.email,
      });
      this.$router.push({ name: "Profile" });
    },
    cancel() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>

<style></style>
