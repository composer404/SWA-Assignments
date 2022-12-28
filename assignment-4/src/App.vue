<template>
  <nav>
    <div v-if="!store.isLoggedIn">
      <router-link to="/login">Login</router-link>
    <router-link to="/signup">Signup</router-link>
  </div>
  <div  v-if="store.isLoggedIn">
    <router-link to="/profile">Profile</router-link> 
    <router-link to="/game">Game</router-link>
    <router-link to="/leaderboard">Leaderboard</router-link>
    <button @click="handleLogout()"  type="submit" class="btn btn-small ml-2 btn-secondary">Logout</button>
  </div>
  </nav>
  <router-view/>
</template>
<script >
import {logout, checkAuthentication } from './services/auth.service'
import { store } from './utils/store'

export default {
    data() {
      return {
        store
      }
    },
    methods: {
      handleLogout() {
        logout();
        this.store.isLoggedIn = false;
        this.$router.replace({path: "/login"})
      },
    },
    beforeMount() {
      // authAction.getAuthState().subscribe((state) => {
      //     this.isLoggedIn = state;
      // });
      this.store.isLoggedIn = checkAuthentication();
    },
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
