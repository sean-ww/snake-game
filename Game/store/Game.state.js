const state = {
  enterScore: false,
  fetchingScores: false,
  fetchingScoresError: null,
  savingScore: false,
  savingScoreError: null,
  scores: [],
  lastGame: {
    finished: false,
    score: 0,
  },
  gameWon: false,
};

export default state;
