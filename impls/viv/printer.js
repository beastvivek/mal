const { MalValue } = require("./types");

const prStr = (malValue, print_readably) => {
  if (malValue instanceof MalValue) {
    return malValue.toString(print_readably);
  }
  return malValue;
};

module.exports = { prStr };