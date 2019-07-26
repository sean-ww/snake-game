<template>
  <div class="game-container">
    <Popup :game-paused="gamePaused" @new-game="createGame" @get-scores="getHighScores" />
    <div id="stage"></div>
  </div>
</template>

<style lang="sass" src="./Game.sass" />

<script>
import Game from './Game';
import keyCode from './keyCode.constants';
import Popup from './Popup';

export default {
  name: 'Game',

  components: {
    Popup,
  },

  data() {
    return {
      game: null,
      difficulty: 10,
      isPlaying: false,
      gameStarted: false,
      gamePaused: false,
      isLeftButtonPressed: false,
      isUpButtonPressed: false,
      isRightButtonPressed: false,
      isDownButtonPressed: false,
    };
  },

  computed: {
    lastGame() {
      return {
        finished: this.$store.getters.finishedGame.finished,
        lastScore: this.$store.getters.finishedGame.score,
      };
    },
  },

  mounted() {
    window.addEventListener('keydown', e => {
      this.buttonPressed(e.keyCode);
    });

    this.getHighScores();
    this.createGame();
  },

  methods: {
    getHighScores() {
      this.$store.dispatch('GET_SCORES');
    },

    createGame() {
      this.removePreviousCells();

      this.game = new Game(this.$store, 24, 24, 24, this.difficulty);
      this.gameStarted = false;
      this.isPlaying = false;
      this.gamePaused = false;

      this.$store.dispatch('TOGGLE_GAME', { finished: false, score: 0 });
      this.$store.dispatch('WIN_GAME', false);
    },

    startGame() {
      this.game.startLoop();

      this.gameStarted = true;
      this.isPlaying = true;
      this.gamePaused = false;

      this.$store.dispatch('TOGGLE_GAME', { finished: false, score: 0 });
      this.$store.dispatch('WIN_GAME', false);
    },

    pauseGame() {
      this.isPlaying = this.game.finishLoop();
      this.gamePaused = true;
    },

    resumeGame() {
      this.isPlaying = this.game.startLoop();
      this.gamePaused = false;
    },

    togglePause() {
      if (this.gamePaused) {
        this.resumeGame();
        return;
      }
      this.pauseGame();
    },

    buttonPressed(key) {
      if (this.lastGame.finished) return;

      const arrowKeyClicked = keyCode.ARROW_KEYS.find(value => value === key);

      if (!this.gameStarted && arrowKeyClicked) {
        this.startGame();
      }

      if (this.gameStarted && this.gamePaused && arrowKeyClicked) {
        this.resumeGame();
      }

      if (key === keyCode.SPACE_KEY) {
        this.togglePause();
      }

      if (this.gameStarted && arrowKeyClicked) {
        this.game.snake.controller(key);
      }
    },

    removePreviousCells() {
      if (this.game !== null) {
        const stage = this.game.stage;

        while (stage.hasChildNodes()) {
          stage.removeChild(stage.lastChild);
        }
      }
    },
  },
};
</script>
