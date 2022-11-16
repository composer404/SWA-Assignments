<template>
  <div>
    <button v-if="!board" @click="createBoard" class="btn btn-primary rounded mt-3 mb-3">Create</button>
    <h1>Game</h1>
    <div v-if="board">
      <div class="text-center">
        <div class="title">Points: {{score}}</div>
        <div class="title">Moves left: {{maxMoves - currentMove}}</div>
      </div>
      <table class="mx-auto position-relative">
        <tbody>
            <tr v-for="(row, index) in getBoardRows()" :key="'row'+index">
              <td v-for="(piece, index) in row" :key="'piece'+index" @click="selectElement(piece)" :class="isSelectedElement(piece) ? 'board-item-selected' : ''" class="board-item" :style="'background-color:'+piece.value"></td>
            </tr>
        </tbody>
        <div v-if="completed" class="overlay">
            <div>GAME FINISHED. YOUR SCORE: {{score}}</div>
            <div>
            <button @click="createBoard" class="btn btn-primary rounded">Again</button>    
            </div>
        </div>
      </table>
    </div>
    <div>
      <button v-if="selectedElement" @click="clearSelection" class="btn btn-primary rounded mt-3">Clear selection</button>
    </div>
  </div>
</template>

<script>
  import { create, initalScan, canMove, move, updateGame, createGame, saveGameId, getGame } from '@/services/game.service'
  import { RandomColorGenerator } from '@/utils/generator'

  export default {
    data() {
      return {
        // rows: [],
        selectedElement: undefined,
        board: undefined,
        generator: undefined,
        score: 0,
        currentMove: 0,
        maxMoves: 3,
        completed: false,
        gameId: undefined,
      }
    },
    methods: {
      async createBoard() {
        this.clearState()
        const initBoard = create(this.generator, 4, 4);
        this.board = initalScan(this.generator, initBoard).board;

        const result = await createGame(JSON.parse(localStorage.getItem(`user`)).userId);
        updateGame(result.id, { board: this.board });
        saveGameId(result.id);
        this.gameId = result.id; 
      },
      getBoardRows() {
        const rows = [];
        for (let i = 0; i < this.board.pieces.length; i +=  this.board.width) {
            rows.push(this.board.pieces.slice(i, i +  this.board.width));
        }
        return rows;
      },
      selectElement(piece) {
        if(!this.selectedElement) {
          this.selectedElement = piece;
          updateGame(this.gameId, { firstSelectedItem: piece });
          return;
        }

        if (!canMove(this.board, this.selectedElement.position, piece.position)) {
          return;
        }

        const result = move(this.generator, this.board, this.selectedElement.position, piece.position);

        const matches = result.effects.filter((effect) => {
        return effect.kind === `Match`;
        });

        matches.forEach(() => {
            this.score += 10;
        })
        this.board = result.board;
        this.selectedElement = undefined;
        this.currentMove += 1;

        updateGame(this.gameId, {
          score: this.score,
          board: this.board,
          firstSelectedItem: null,
          currentMove: this.currentMove,
        });

        if (this.currentMove === this.maxMoves) {
          this.finishGame();
        }
      },
      finishGame() {
          this.completed = true;
          updateGame(this.gameId, { completed: true });
      },
      clearState() {
        this.board = undefined;
        this.currentMove = 0;
        this.completed = false;
        this.score = 0;
        this.rows = [];
      },
      isSelectedElement(piece) {
        return this.selectedElement?.position.col === piece.position.col && this.selectedElement?.position.row === piece.position.row;  
      },
      clearSelection() {
        this.selectedElement = undefined;
        updateGame(this.gameId, { firstSelectedItem: undefined });
      }
    },
    beforeMount() {
      this.generator = new RandomColorGenerator();
      if (localStorage.getItem(`currentGameId`)) {
        getGame(localStorage.getItem(`currentGameId`)).then((game) => {
          this.board = game.board;
          this.score = game.score;
          this.gameId = game.id;
          this.currentMove = game.currentMove;
          this.selectedElement = game.firstSelectedItem;
          this.completed = game.completed;
        });
      }
    },
  }
</script>
<style>
  .board-item {
    width: 100px;
    height: 100px;
    border: 1px solid black;
    cursor: pointer;
  }

  .board-item-selected {
    border: 5px solid black;
  }

  .overlay {
    background-color: white;
    border-radius: 6px;
    padding: 10px;
    position: absolute;
    left: 80px;
    top: 160px;
  }

  .game-box {
    width: 401px;
    position: relative;
  }

  .title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
}

</style>
