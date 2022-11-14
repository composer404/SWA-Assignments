<template>
  <nav>
    <router-link to="/login" v-if="!currentUser" >Login</router-link>
    <router-link to="/signup"  v-if="!currentUser" >Signup</router-link>
    <router-link to="/profile" v-if="currentUser">Profile</router-link>
    <router-link to="/game" v-if="currentUser">Game</router-link>
    <router-link to="/leaderboard" v-if="currentUser">Leaderboard</router-link>
    <button @click="logOut" type="submit">Logout</button>
  </nav>
  <router-view/>
</template>
<script>
import {logout} from './services/auth.service'
export default {
//   computed: {
//     currentUser() {
//       return this.$store.state.auth.user;
//     },
//     methods: {
//     logOut() {
//       this.$store.dispatch('auth/logout');
//       this.$router.push('/login');
//     }
//   },
// },
// }
  
  computed: {
      isLoggedIn() {
        console.log(JSON.parse(localStorage.getItem("user")) === "true");

        if (localStorage.getItem("user") === "true")  {
          console.log("STORAGE LOGGED IN TRUE");
        }
        else  {
          console.log("STORAGE LOGGED IN FALSE");
        }

        return localStorage.getItem("user") === "true";
      }
    },

    methods:{
      logout1(){
      logout().then(() => {
          this.$router.push({path: "/login"});
        })
    }
  }
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
