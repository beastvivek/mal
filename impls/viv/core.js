const { Env } = require("./env");
const { MalSymbol, MalList, MalNil } = require("./types");

const globalEnv = new Env();
globalEnv.set(new MalSymbol('+'), (a, b) => a + b,);
globalEnv.set(new MalSymbol('-'), (a, b) => a - b,);
globalEnv.set(new MalSymbol('*'), (a, b) => a * b,);
globalEnv.set(new MalSymbol('/'), (a, b) => a / b,);
globalEnv.set(new MalSymbol('='), (a, b) => a === b,);
globalEnv.set(new MalSymbol('>'), (a, b) => a > b,);
globalEnv.set(new MalSymbol('<'), (a, b) => a < b,);
globalEnv.set(new MalSymbol('<='), (a, b) => a <= b,);
globalEnv.set(new MalSymbol('>='), (a, b) => a >= b,);
globalEnv.set(new MalSymbol('not'), (a) => {
  if (!a || a instanceof MalNil) {
    return true;
  }
  return false;
});
globalEnv.set(new MalSymbol('list'), (...a) => '(' + a.toString() + ')' );
globalEnv.set(new MalSymbol('prn'), (...a) => {
  a.map((e) => console.log(e));
  return new MalNil();
});
// globalEnv.set(new MalSymbol('list'), (...a) => new MalList(a));
// globalEnv.set(new MalSymbol('count'), (a) => a.value.length());

module.exports = { globalEnv };