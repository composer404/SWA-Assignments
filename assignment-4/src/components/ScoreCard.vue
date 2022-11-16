<template>
    <div className="score-card">
        <div>Game ID: {{score.id}}</div>
        <div>SCORE: {{score.score}}</div>
        <div>USER: <span v-if="username">{{username}}</span> (id: {{score.user}})</div>
    </div>
</template>
  
  <script>
// import { getUser } from '../services/auth.service'

  export default {
    data() {
        return {
            username: undefined,
        }
    },
    methods: {},
    props: {
        score: undefined,
    },
    beforeMount() {
        // ! Not possible with api guard
        // getUser(this.score.user).then((data) => {
        //     this.username = data.username;
        // });
    }
  }
  </script>
  
  <style scoped>
.score-card {
  border-radius: 6px;
  border: 1px solid black;
  background-color: rgb(22, 22, 22);
  padding: 10px;
  color:  white;
  margin-bottom: 15px;
}
</style>
  