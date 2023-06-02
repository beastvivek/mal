const { MalList, MalVector } = require("./types");

class Env {
  #outer;
  constructor(outer, binds, exprs) {
    this.#outer = outer;
    this.binds = binds;
    this.exprs = exprs;
    this.data = {};
  }

  initialize() {
    if (this.binds && this.exprs) {
      for (let i = 0; i < this.binds.length; i++) {
        if (this.binds[i].value === '&') {
          return this.set(this.binds[i+1], new MalVector(this.exprs.slice(i)));
        }
        this.set(this.binds[i], this.exprs[i]);
      }
    }
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }
    if (this.#outer) {
      return this.#outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) {
      throw `${symbol.value} not found`;
    }
    return env.data[symbol.value];
  }
}

module.exports = { Env };