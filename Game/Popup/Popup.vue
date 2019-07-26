<template>
  <transition name="fade">
    <div v-if="gamePaused" class="paused-game-popup game-popup">
      <p>Game Paused</p>
    </div>

    <div v-if="lastGame.finished && enterScore" class="score-game-popup game-popup">
      <p><strong>Congratulations great score!</strong></p>
      <p>
        Your score is<br /><span>{{ lastGame.lastScore }}</span>
      </p>
      <input
        v-model="name"
        class="add-name-field"
        autofocus
        autocomplete="off"
        placeholder="Add your name"
        maxlength="24"
      />
      <button @click="saveHighScore">Add to Leaderboard</button>
      <span v-if="savingScore">Button Loading</span>
      <span v-if="savingScoreError">Saving score failed</span>
    </div>

    <div v-if="lastGame.finished && !enterScore" class="finished-game-popup game-popup">
      <p><strong>Game Over</strong></p>
      <p>
        Your score is<br /><span>{{ lastGame.lastScore }}</span>
      </p>
      <Leaderboard></Leaderboard>
      <button @click="$emit('new-game')">New Game</button>
    </div>
  </transition>
</template>

<style lang="sass" src="./Popup.sass" scoped />

<script>
import Leaderboard from '../Leaderboard';

export default {
  name: 'Popup',

  components: {
    Leaderboard,
  },

  props: {
    gamePaused: { type: Boolean, required: true },
  },

  data() {
    return {
      name: '',
    };
  },

  computed: {
    enterScore() {
      return this.$store.getters.enterScore;
    },

    lastGame() {
      return {
        finished: this.$store.getters.finishedGame.finished,
        lastScore: this.$store.getters.finishedGame.score,
      };
    },

    savingScore() {
      return this.$store.getters.savingScore;
    },

    savingScoreError() {
      return this.$store.getters.savingScoreError;
    },
  },

  methods: {
    saveHighScore() {
      const name = this.name !== '' ? this.name : 'anon';
      this.$store.dispatch('SAVE_SCORE', { name, score: this.lastGame.lastScore }).then(() => {
        this.$emit('get-scores');
      });
    },
  },
};
</script>
