<template>
  <transition name="fade">
    <div class="leaderboard align-center">
      <p><strong>Leaderboard</strong></p>
      <LoadingSpinner v-if="fetchingScores" />

      <table v-if="scores.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(scoreObj, index) in scores" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ scoreObj.name }}</td>
            <td>{{ scoreObj.score }}</td>
          </tr>
        </tbody>
      </table>

      <h2 v-if="scores.length === 0 && fetchingScoresError === null">No scores.<br />Let's play a few times!</h2>
      <h2 v-if="fetchingScoresError !== null">There was a problem retrieving the scores.</h2>
    </div>
  </transition>
</template>

<script>
import LoadingSpinner from '../LoadingSpinner';

export default {
  name: 'Leaderboard',

  components: {
    LoadingSpinner,
  },

  computed: {
    scores() {
      return this.$store.getters.allScores;
    },

    fetchingScores() {
      return this.$store.getters.fetchingScores;
    },

    fetchingScoresError() {
      return this.$store.getters.fetchingScoresError;
    },
  },
};
</script>

<style lang="sass" src="./Leaderboard.sass" scoped />
