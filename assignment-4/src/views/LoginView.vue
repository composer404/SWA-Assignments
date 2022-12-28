<template>
  <div>
    <h1>Login</h1>

    <div class="w-35 mx-auto card p-4 text-left mt-4">
      <form @submit.prevent="signIn">
        <div class="form-group mt-4">
          <div>Username</div>
          <input v-model="username" type="text" class="form-control mt-1">
          <small class="text-danger" v-if="username.length && usernameInvalid">Username should be between 3 - 12 letters</small>
        </div>
        <div class="form-group mt-4">
          <div>Password</div>
          <input v-model="password" type="password" class="form-control mt-1">
          <small class="text-danger" v-if="password.length && passwordInvalid">Password should be between 3 - 12 letters</small>
        </div>
        <button :disabled="usernameInvalid || passwordInvalid" type="submit" class="w-100 btn btn-primary mt-4 mb-3">Login</button>
      
        <div v-if="error" class="alert alert-danger">
          Error occurred. Try again later.
        </div>

        <div v-if="authenticationError" class="alert alert-danger">
          Invalid login or password
        </div>

        <div v-if="success" class="alert alert-success" >
          Login successful!
        </div>
      </form>
    </div>
  </div>
</template>

<script >
import {login} from '../services/auth.service';
import { store } from '../utils/store'

  export default {
    data() {
      return {
        username: '',
        password: '',
        error: undefined,
        success: undefined,
        
        usernameInvalid: true,
        passwordInvalid: true,
        authenticationError: false,
        store,
      }
    },


    watch: {
      username() {
        if(this.username.length < 3 || this.username.length > 12) {
            this.usernameInvalid = true;
            return;
          }
          this.usernameInvalid = false;
      },
      password() {
        if(this.password.length < 3 || this.password.length > 12) {
            this.passwordInvalid = true;
            return;
          }
          this.passwordInvalid = false;
      }
    },
    methods: {
      signIn() {
        this.error = false;
        this.authenticationError = false;
        this.success = false;
      

        login(this.username, this.password).then(() => {
          this.success = true;
          this.store.isLoggedIn = true;
          this.$router.replace({path: "/game"})

        }).catch((err) => {
          if (err.message.includes('403')) {
            this.authenticationError = true;
            return;
          }

          this.error = true;
        })
      },
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
