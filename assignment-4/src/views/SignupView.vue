<template>
  <div>
    <h1>Signup</h1>

    <div class="w-35 mx-auto card p-4 text-left mt-4">
      <form @submit.prevent="signup">
        <div class="form-group mt-4">
          <div>Username</div>
          <input v-model="username" type="text" class="form-control mt-1">
        </div>
        <div class="form-group mt-4">
          <div>Password</div>
          <input v-model="password" type="password" class="form-control mt-1">
        </div>
        <button type="submit" class="w-100 btn btn-primary mt-4 mb-3">Signup</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        username: '',
        password: '',
      }
    },
    methods: {
      signup() {
       //console.log(this.username, this.password);
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