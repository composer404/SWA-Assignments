<template>
  <div>
  <h1>Profile</h1>

  <div class="w-35 mx-auto card p-4 text-left mt-4">
    <form @submit.prevent="editUser">
      <div class="form-group mt-4">
        <div>Username</div>
        <input v-model="username" type="text" :disabled="disabled" class="form-control mt-1">
      </div>
      <div class="form-group mt-4">
        <div>Old Password</div>
        <input v-model="oldPassword" type="password" :disabled="disabled" class="form-control mt-1">
      </div>
      <div class="form-group mt-4">
        <div>New Password</div>
        <input v-model="newPassword" type="password" class="form-control mt-1">
        <small class="text-danger" v-if="newPassword.length && passwordInvalid">Password should be between 3 - 12 letters</small>
      </div>
      <button :disabled="usernameInvalid || passwordInvalid" type="submit" class="w-100 btn btn-primary mt-4 mb-3" @click="disabled=!disabled"
      >Save Changes</button>

      <div v-if="error" class="alert alert-danger">
        Error occured. Try again later.
      </div>

      <div v-if="success" class="alert alert-success">
        Account updated successfully!
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import {getUser, updateUser} from '../services/auth.service';

export default {
  data() {
    return {
      username: '',
      oldPassword: '',
      newPassword: '',
      error: undefined,
      success: undefined,
      number: 0,
      disabled: true,

      passwordInvalid: true,
    }
  },
  watch: {
    newPassword() {
      if(this.password.length < 3 || this.password.length > 12) {
        this.passwordInvalid = true;
        return;
      }
      this.passwordInvalid = false;
    }
  },
  methods: {
    editUser() {
      this.error = false;
      this.success = false;

      updateUser(this.username, this.newPassword).then(() => {
        this.success = true;
      }).catch(() => {
        this.error = true;
      })

      getUser(this.number.id).then(() => {
        this.success = true;
      }).catch(() => {
        this.error = true;
      })
    }
  }
}
</script>

<style>
.text-left {
  text-align: left;
}
.w-35 {
  width: 35%;
}
</style>
