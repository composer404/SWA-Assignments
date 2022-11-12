<template>
  <div>
    <h1>Leaderboard</h1>
    <div class="d-flex w-100 p-4">
      <div class="w-50 p-4">
        <div class="title">BEST USER SCORES</div>
          <ScoreCard v-for="(userScore, index) in userBest" :key="'userbestItem' + index" :score="{...userScore}"/>
      </div>
      <div class="w-50 p-4">
        <div class="title">BEST TOTAL SCORES</div>
        <ScoreCard v-for="(totalBest, index) in userBest" :key="'userbestItem' + index" :score="{...totalBest}"/>
      </div>
    </div>
  </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import ScoreCard from '@/components/ScoreCard.vue';
    import { getGames } from '@/services/game.service';

   export default {
    data() {
      return {
        totalBest: [],
        userBest: [],
      }
    },
    components: {ScoreCard},
    methods: {
      getBestScoreForUser() {
        return this.games.filter((game) => {
            return game.completed && game.user === JSON.parse(localStorage.getItem(`user`)).userId;
        }).sort((a, b) => {
            return b.score - a.score;
        }).slice(0, 3);
      },
      getBestTotalBestScore() {
        return this.games.filter((game) => {
                return game.completed;
            }).sort((a, b) => {
                return b.score - a.score;
            }).slice(0, 10);
      }
    },
    beforeMount() {
      getGames().then((result) => {
          this.userBest = result.data.filter((game) => {
            return game.completed && game.user === JSON.parse(localStorage.getItem(`user`)).userId;
          }).sort((a, b) => {
              return b.score - a.score;
          }).slice(0, 3);

          this.totalBest = result.data.filter((game) => {
                return game.completed;
            }).sort((a, b) => {
                return b.score - a.score;
            }).slice(0, 10);
      });
    }
  }
</script>
<style>
    .title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
}
</style>
