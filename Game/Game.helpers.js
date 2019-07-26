export const findLowestHighScore = scores => {
  if (scores.length < 1) {
    return 0;
  }

  let min = scores[0].score;

  for (let i = 1; i < scores.length; i++) {
    const testValue = scores[i].score;
    min = testValue < min ? testValue : min;
  }

  return min;
};
