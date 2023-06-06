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
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  #toPrintedRepresentation(str) {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\"/g, '\\\"');
  }

  toString(print_readably = true) {
    if (print_readably) {
      return `"${this.#toPrintedRepresentation(this.value.toString())}"`
    }
    return this.value.toString();
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
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

  toString() {
    return '[' + this.value.map(x=>x.toString()).join(' ') + ']';
  }
}

class MalMap extends MalValue {
  constructor(value) {
    super(value);
  }

  toString() {
    return '{' + this.value.map(x=>x.toString()).join(' ') + '}';
  }
}

class MalNil extends MalValue  {
  constructor(value) {
    super(value);
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

  toString(print_readably = false) {
    return '(atom ' + this.value.toString() + ')';
  }
}

module.exports = { MalList, MalAtom , MalSymbol  , MalVector , MalValue, MalMap , MalNil , MalKeyword, MalString, MalFunction};