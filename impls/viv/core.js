const fs = require('fs');
const { prStr } = require("./printer");
const { readStr } = require("./reader");
const { MalList, MalString, MalAtom, MalVector, deepEqual, MalValue } = require("./types");

const listCount = (list) => {
  if (list instanceof MalValue) {
    return list.value ? list.value.length : 0
  }
};

const print = (args, printReadably) => {
  console.log(...args.map((arg) => prStr(arg, printReadably)));
  return new MalNil();
};

const coreMethod = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => a instanceof MalValue? a.equals(b) : deepEqual(a, b),
  '+': (...args) => args.reduce((x, y) => x + y, 0),
  '*': (...args) => args.reduce((x, y) => x * y, 1),
  '-': (...args) => args.reduce((x, y) => x - y),
  '/': (...args) => args.reduce((x, y) => Math.round(x / y)),
  'list': (...args) => new MalList(args),
  'vector': (...args) => new MalVector(args),
  'count': listCount,
  'list?': (args) => args instanceof MalList,
  'empty?': (args) => listCount(args) === 0,
  'prn': (...args) => print(args, true),
  'println': (...args) => print(args, false),
  'pr-str': (...args) => {
    const str = args.map((arg) => prStr(arg, true)).join(' ');
    return new MalString(str);
  },
  'str': (...args) => {
    const str = args.map((arg) => prStr(arg, false)).join('');
    return new MalString(str);
  },
  'read-string': (string) => {
    if (string instanceof MalString) {
      return readStr(string.value);
    }
    return readStr(string)
  },
  'slurp': (filename) => new MalString(fs.readFileSync(filename, 'utf8')),
  'atom': (args) => new MalAtom(args),
  'atom?': (args) => args instanceof MalAtom,
  'deref': (args) => args.deref(),
  'reset!': (atom, newValue) => atom.reset(newValue),
  'swap!': (atom, f, ...args) => atom.swap(f, args),
  'cons': (value, list) => new MalList([value, ...list.value]),
  'concat': (...lists) => new MalList(lists.flatMap(x => x.value)),
  'vec': (args) => new MalVector(args.value),
  "*ARGV*": new MalList(process.argv.slice(2)),
}

module.exports = { coreMethod };