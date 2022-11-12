<template>
  <div>
    <button @click="createBoard">Create</button>
    <h1>Game</h1>
  </div>
</template>

<script>
  import { create, initalScan } from '@/services/game.service'
  import { RandomColorGenerator } from '@/utils/generator'

  export default {
    data() {
      return {
        username: '',
        password: '',
      }
    },
    methods: {
      createBoard() {
        const generator = new RandomColorGenerator();

        // Clears all matches before save in state
        const initBoard = create(generator, 4, 4);
        const { board } = initalScan(generator, initBoard);
        console.log(`board`, board);
      }
    }
  }
</script>
