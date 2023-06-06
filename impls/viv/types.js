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

const toPrintedRepresentation = (str) => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\"/g, '\\\"');
};

class MalValue {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalSymbol) &&  deepEqual(item.value, this.value);
  }
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalKeyword) &&  deepEqual(item.value, this.value);
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalString) &&  deepEqual(item.value, this.value);
  }

  toString(print_readably = true) {
    if (print_readably) {
      return `"${toPrintedRepresentation(this.value.toString())}"`
    }
    return this.value.toString();
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalList) && deepEqual(item.value, this.value);
  }

  toString() {
    return '(' + this.value.map(x=>x.toString()).join(' ') + ')';
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalVector) &&  deepEqual(item.value, this.value);
  }

  toString() {
    return '[' + this.value.map(x=>x.toString()).join(' ') + ']';
  }
}

class MalMap extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalMap) &&  deepEqual(item.value, this.value);
  }

  toString() {
    return '{' + this.value.map(x=>x.toString()).join(' ') + '}';
  }
}

class MalNil extends MalValue  {
  constructor(value) {
    super(value);
  }

  equals(item) {
    return (item instanceof MalNil) &&  deepEqual(item.value, this.value);
  }

  toString() {
    return "nil";
  }
}

class MalFunction extends MalValue {
  constructor(ast, binds, env, fn) {
    super(ast);
    this.binds=binds;
    this.env = env;
    this.fn = fn;
  }

  apply(context, args) {
    this.fn.apply(context, ...args);
  }

  equals(item) {
    return (item instanceof MalFunction) &&  deepEqual(item.value, this.value);
  }

  toString() {
    return "#<function>";
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  reset(value) {
    this.value = value;
    return this.value;
  }

  swap(func, args) {
    this.value = func.apply(null, [this.value, ...args]);
    return this.value;
  }

  deref() {
    return this.value;
  }

  equals(item) {
    return (item instanceof MalAtom) &&  deepEqual(item.value, this.value);
  }

  toString(print_readably = false) {
    return '(atom ' + this.value.toString() + ')';
  }
}

module.exports = { MalList, MalAtom , MalSymbol  , MalVector , MalValue, MalMap , MalNil , MalKeyword, MalString, MalFunction, deepEqual};