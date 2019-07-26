export default {
  allScores(state) {
    // Do not mutate array and sort by score value
    return state.scores.concat().sort((scoreA, scoreB) => {
      return scoreB.score - scoreA.score;
    });
  },

  enterScore(state) {
    return state.enterScore;
  },

  fetchingScores(state) {
    return state.fetchingScores;
  },

  fetchingScoresError(state) {
    return state.fetchingScoresError;
  },

  savingScore(state) {
    return state.savingScore;
  },

  savingScoreError(state) {
    return state.savingScoreError;
  },

  finishedGame(state) {
    return {
      finished: state.lastGame.finished,
      score: state.lastGame.score,
    };
  },

  gameWon(state) {
    return state.gameWon;
  },
};
