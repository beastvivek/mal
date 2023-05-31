const pr_str = malValue => {
  if (typeof malValue === "function") {
    return "#<function>";
  }
  return malValue.toString();
};

module.exports = { pr_str };