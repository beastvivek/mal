const { Env } = require("./env");
const fs = require('fs');
const { pr_str } = require("./printer");
const { read_str } = require("./reader");
const { MalSymbol, MalList, MalNil, MalValue, MalString, MalAtom} = require("./types");

const areBothArrays = (element1, element2) => {
    return Array.isArray(element1) && Array.isArray(element2);
};

const deepEqual = (malValue1, malValue2) => {
  const list1 = malValue1 instanceof MalValue ? malValue1.value : malValue1;
  const list2 = malValue2 instanceof MalValue ? malValue2.value : malValue2;
  
  if (!areBothArrays(list1, list2)) {
      return list1 === list2;
  }

  if (list1.length !== list2.length) {
      return false;
  }

  for (let index = 0; index < list1.length; index++) {
    if (!deepEqual(list1[index], list2[index])) {
      return false;
    }
  }

  return true;
};

const globalEnv = new Env();
globalEnv.set(new MalSymbol('+'), (a, b) => a + b,);
globalEnv.set(new MalSymbol('-'), (a, b) => a - b,);
globalEnv.set(new MalSymbol('*'), (a, b) => a * b,);
globalEnv.set(new MalSymbol('/'), (a, b) => a / b,);
globalEnv.set(new MalSymbol('='), (a, b) => deepEqual(a,b),);
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
    return a.value;
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

module.exports = { globalEnv };