const { Env } = require("./env");
const fs = require('fs');
const { pr_str } = require("./printer");
const { read_str } = require("./reader");
const { MalSymbol, MalList, MalNil, MalString, MalAtom, MalVector, deepEqual, MalValue } = require("./types");

const globalEnv = new Env();
globalEnv.set(new MalSymbol('+'), (a, b) => a + b,);
globalEnv.set(new MalSymbol('-'), (a, b) => a - b,);
globalEnv.set(new MalSymbol('*'), (a, b) => a * b,);
globalEnv.set(new MalSymbol('/'), (a, b) => a / b,);
globalEnv.set(new MalSymbol('='), (a, b) => {
  if (a instanceof MalValue && b instanceof MalValue) { 
    return a.equals(b);
  }
  return deepEqual(a,b);
});
globalEnv.set(new MalSymbol('>'), (a, b) => a > b,);
globalEnv.set(new MalSymbol('<'), (a, b) => a < b,);
globalEnv.set(new MalSymbol('<='), (a, b) => a <= b,);
globalEnv.set(new MalSymbol('>='), (a, b) => a >= b,);
globalEnv.set(new MalSymbol('not'), (a) => {
  if (a === false || a instanceof MalNil) {
    return true;
  }
  return false;
});
globalEnv.set(new MalSymbol('list'), (...a) => '(' + a.toString() + ')' );
globalEnv.set(new MalSymbol('prn'), (...a) => {
  const line = a.map((e) => pr_str(e,true)).join(' ');
  console.log(line);
  return new MalNil();
});

globalEnv.set(new MalSymbol('println'), (...a) => {
  const line = a.map((e) => pr_str(e,false)).join(' ');
  console.log(line);
  return new MalNil();
});

globalEnv.set(new MalSymbol('str'), (...a) => {
  const line = a.map((e) => pr_str(e, false)).join('');
  return new MalString(line);
});

globalEnv.set(new MalSymbol('pr-str'), (...a) => {
  const line = a.map((e) => pr_str(e,true)).join(' ');
  return new MalString(line);
});
globalEnv.set(new MalSymbol('list'), (...a) => new MalList(a));
globalEnv.set(new MalSymbol('count'), (a) =>a.value.length);
globalEnv.set(new MalSymbol('list?'), (a) => a instanceof MalList);
globalEnv.set(new MalSymbol('empty?'), (a) => a.value.length === 0);
globalEnv.set(new MalSymbol('read-string'), (a) => read_str(a.value));
globalEnv.set(new MalSymbol('slurp'), (a) => new MalString(fs.readFileSync(a.value, 'utf-8')));
globalEnv.set(new MalSymbol('atom'), (a) => new MalAtom(a));
globalEnv.set(new MalSymbol('atom?'), (a) => a instanceof MalAtom);
globalEnv.set(new MalSymbol('deref'), (a) => {
  if (a instanceof MalAtom) {
    return a.deref();
  }
});
globalEnv.set(new MalSymbol('reset!'), (atom, value) => {
  if (atom instanceof MalAtom) {
    return atom.reset(value);
  }
});
globalEnv.set(new MalSymbol('swap!'), (atom, func, ...args) => {
  return atom.swap(func,args);
});
globalEnv.set(new MalSymbol('cons'), (value, list) => new MalList([value, ...list.value]));
globalEnv.set(new MalSymbol('concat'), (...lists) => new MalList(lists.flatMap(x => x.value)));
globalEnv.set(new MalSymbol('vec'), (a) => new MalVector(a.value));

module.exports = { globalEnv };