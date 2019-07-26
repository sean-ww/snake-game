const keyCodes = {
  SPACE_KEY: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

const combinedKeyCodes = {
  ...keyCodes,
  ARROW_KEYS: [keyCodes.ARROW_LEFT, keyCodes.ARROW_UP, keyCodes.ARROW_RIGHT, keyCodes.ARROW_DOWN],
};

export default combinedKeyCodes;
