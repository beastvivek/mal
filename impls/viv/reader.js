const { MalList, MalSymbol, MalVector, MalMap, MalNil, MalKeyword, MalString } = require("./types.js");

class Reader {
  constructor (tokens) {
    this.tokens = tokens;  
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const prependSymbol = (reader, symbol) => {
  reader.next();
  const prepend_symbol = new MalSymbol(symbol);
  const newAst = read_form(reader);
  return new MalList([prepend_symbol, newAst]);
}

const tokenize = (str) => {
  const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(re)].map(x => x[1]).slice(0,-1);
};

const read_atom = reader => {
  const token = reader.next();
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }

  if (token === 'true') {
    return true;
  }

  if (token === 'false') {
    return false;
  }

  if (token === 'nil') {
    return new MalNil(token);
  }

  if (token[0] === ':') {
    return new MalKeyword(token);
  }

  if (token[0] === '"') {
    return new MalString(token.slice(1,-1));
  }

  return new MalSymbol(token);
};

const read_seq = (reader, closingSymbol) => {
  const ast = [];
  while (reader.peek() !== closingSymbol) {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }

  reader.next();
  return ast;
};

const read_list = reader => {
  const ast = read_seq(reader, ')');
  return new MalList(ast);
};

const read_vector = reader => {
  const ast = read_seq(reader, ']');
  return new MalVector(ast);
};

const read_map = reader => {
  const ast = read_seq(reader, '}');
  return new MalMap(ast);
};

const read_string = reader => {
  const ast = read_seq(reader, '"');
  return new MalString(ast);
};

const read_form = reader => {
  const token = reader.peek();
  switch (token) {
    case '(':
      reader.next();
      return read_list(reader);
    case '[':
      reader.next();
      return read_vector(reader);
    case '{':
      reader.next();
      return read_map(reader);
    case '"':
      reader.next();
      return read_string(reader);
    case '\'':
      return prependSymbol(reader, 'quote');
    case '`':
      return prependSymbol(reader, 'quasiquote');
    case '~':
      return prependSymbol(reader, 'unquote');
    case '~@':
      return prependSymbol(reader, 'splice-unquote');
    default:
      return read_atom(reader);
  }
};

const readStr = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { readStr };