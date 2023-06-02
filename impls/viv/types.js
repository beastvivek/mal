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
  constructor(ast, binds, env) {
    super(ast);
    this.binds=binds;
    this.env=env;
  }

  toString() {
    return "#<function>";
  }
}

module.exports = { MalList , MalSymbol  , MalVector , MalValue, MalMap , MalNil , MalKeyword, MalString, MalFunction};