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
        <input v-model="oldPassword" type="password" class="form-control mt-1">
        <small class="text-danger" v-if="oldPassword.length && oldPasswordInvalid">Password should be between 3 - 12 letters</small>
      </div>
      <div class="form-group mt-4">
        <div>New Password</div>
        <input v-model="newPassword" type="password" class="form-control mt-1">
        <small class="text-danger" v-if="newPassword.length && newPasswordInvalid">Password should be between 3 - 12 letters</small>
      </div>
      <button type="submit" class="w-100 btn btn-primary mt-4 mb-3"
      >Save Changes</button>

      <div v-if="error" class="alert alert-danger">
        Error occured. Try again later.
      </div>

      <div v-if="passwordMismatch" class="alert alert-danger">
        Old password is incorrect!
      </div>

      <div v-if="success" class="alert alert-success">
        Account updated successfully!
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import { getUser, updateUser} from '../services/auth.service';

export default {
  data() {
    return {
      username: '',
      oldPassword: '',
      oldPasswordForAPI: ``,
      newPassword: '',
      error: undefined,
      success: undefined,
      number: 0,
      disabled: true,
      userId: undefined,

      oldPasswordInvalid: true,
      newPasswordInvalid: true,
      passwordMismatch: false,
    }
  },
  watch: {
    newPassword() {
      if(this.newPassword.length < 3 || this.newPassword.length > 12) {
        this.newPasswordInvalid = true;
        return;
      }
      this.newPasswordInvalid = false;
    },
    oldPassword() {
      if(this.oldPassword.length < 3 || this.oldPassword.length > 12) {
        this.oldPasswordInvalid = true;
        return;
      }
      this.oldPasswordInvalid = false;
    }
  },
  methods: {
    editUser() {
      this.error = false;
      this.success = false;
      this.passwordInvalid = false;
      this.passwordMismatch = false;

      if (this.oldPassword !== this.oldPasswordForAPI) {
        this.passwordMismatch = true;
        return;
      }

      updateUser(this.userId, {
        password: this.newPassword,
      }).then(() => {
        this.success = true;
      }).catch(() => {
        this.error = true;
      })
    },
  }, 
  beforeMount() {
       if (localStorage.getItem(`user`)) {
        this.userId = parseInt(JSON.parse(localStorage.getItem(`user`)).userId, 10);
        getUser(this.userId).then((response) => {
          this.username = response.username;
          this.oldPasswordForAPI = response.password;
        });
      }
    },
  
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
