const { MalValue } = require("./types");

const pr_str = (malValue, print_readably) => {
  if (malValue instanceof MalValue) {
    return malValue.toString(print_readably);
  }
  return malValue;
};

module.exports = { pr_str };