<template>
  <nav>
    <div v-if="!isLoggedIn()">
      <router-link to="/login">Login</router-link>
    <router-link to="/signup">Signup</router-link>
  </div>
  <div  v-if="isLoggedIn()">
    <router-link to="/profile">Profile</router-link> 
    <router-link to="/game">Game</router-link>
    <router-link to="/leaderboard" >Leaderboard</router-link>
    <button @click="handleLogout()"  type="submit">Logout</button>
  </div>
  </nav>
  <router-view/>
</template>
<script >
import {logout, LoggedIn} from './services/auth.service'
import {getLoggedInSubject} from './services/auth.service'
export default {
  data () {
        return {
            message: []
        };
    },
    methods: {
    handleLogout() {
     logout();
     this.$router.replace({path: "/login"})
    },
    isLoggedIn()
    {
      getLoggedInSubject.subscribe((data) => {
        LoggedIn();
        subject.next()
      })

      // LoggedIn(): Observable<boolean>{
      //   isLoginSubject.asObservable(),
      // };
     // return this.isLoginSubject.asObservable();
    }
  },
  // created()
  // {
  //   this.subscription = getLoggedInSubject.subscribe(this.message =>{
  //     if(message){
  //       this.message.push(message),
  //     },else {
  //       message =[];
  //   }),
  // },
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
