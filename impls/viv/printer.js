const pr_str = (malValue, print_readably) => {
  if (typeof malValue === "function") {
    return "#<function>";
  }
  return malValue.toString(print_readably);
};

module.exports = { pr_str };