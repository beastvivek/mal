const readline = require('readline');
const { read_str } = require('./reader.js');
const { pr_str } = require('./printer.js');
const { MalSymbol, MalList, MalMap, MalVector, MalNil, MalFunction } = require('./types.js');
const { Env } = require('./env.js');
const { globalEnv } = require('./core.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handleDef = (env, ast) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const handleLet = (env, ast) => {
  const let_env = new Env(env);
  const list = ast.value[1].value;
  for (let index = 0; index < list.length; index += 2) {
    let_env.set(list[index], EVAL(list[index + 1], let_env));
  }

  const doAst = new MalList([new MalSymbol('do'), ...ast.value.slice(2)]);
  return [doAst, let_env];
};

const handleDo = (ast, env) => {
  const restList = ast.value.slice(1);
  for (let index = 0; index < restList.length - 1; index++) {
    EVAL(restList[index], env);
  }
  return restList[restList.length - 1];
};

const handleIf = (ast, env) => {
  const predicate = ast.value[1];
  const ifTrueDo = ast.value[2];
  const ifFalseDo = ast.value[3];

  const boolean = EVAL(predicate, env);
  return (!boolean || boolean instanceof MalNil) ? ifFalseDo : ifTrueDo;
};

const handleFn = (ast, env) => {
  const doAst = new MalList([new MalSymbol('do'), ...ast.value.slice(2)]);
  const fn =  (...arguments) => {
    const fn_env = new Env(env, ast.value[1].value, arguments);
    fn_env.initialize();
    const doAst = new MalList([new MalSymbol('do'), ...ast.value.slice(2)]);
    return EVAL(doAst, fn_env);
  };
  
  return new MalFunction(doAst, ast.value[1].value, env, fn);
};

const quasiQuote = (ast, env) => {
  if (
    ast instanceof MalList &&
    ast.value.length > 0 &&
    ast.value[0].value === "unquote"
  ) {
    return ast.value[1];
  }

  if (ast instanceof MalList) {
    let result = new MalList([]);
    for (let index = ast.value.length - 1; index >= 0; index--) {
      const element = ast.value[index];
      if (
        element instanceof MalList &&
        element.value.length > 0 &&
        element.value[0].value === "splice-unquote"
      ) {
        result = new MalList([
          new MalSymbol("concat"),
          element.value[1],
          result,
        ]);
      } else {
        result = new MalList([
          new MalSymbol("cons"),
          quasiQuote(element,env),
          result,
        ]);
      }
    }
    return result;
  }

  if (ast instanceof MalSymbol || ast instanceof MalMap) {
    return new MalList([new MalSymbol("quote"), ast]);
  }
  return ast;
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }

  if (ast instanceof MalMap) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalMap(newAst);
  }

  return ast;
};

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  while (true) { 
    if (!(ast instanceof MalList)) {
      return eval_ast(ast, env);
    }
  
    if (ast.isEmpty()) {
      return ast;
    }
  
    switch (ast.value[0].value) {
      case 'def!':
        return handleDef(env, ast);
      
      case 'let*':
        [ast, env] = handleLet(env, ast);
        break;
      
      case 'do':
        ast = handleDo(ast, env);
        break;
      
      case 'if':
        ast = handleIf(ast, env);
        break;
      
      case 'fn*':
        ast = handleFn(ast, env);
        break;
      
      case 'quote':
        return ast.value[1];
      
      case 'quasiquoteexpand':
        return quasiQuote(ast.value[1], env);
      
      case 'quasiquote':
        ast = quasiQuote(ast.value[1], env);
        break;
      
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          env = new Env(fn.env, fn.binds, args);
          env.initialize();
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const PRINT = malValue => pr_str(malValue);

const rep = str => PRINT(EVAL(READ(str), env));

const env = globalEnv;
env.set(new MalSymbol("not"), (arg) =>
  rep(`((fn* [x] (if x false true)) ${get_value(arg)})`)
);
env.set(new MalSymbol("eval"), (ast) => EVAL(ast, env));
rep('(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))');

const repl = () =>
  rl.question('user> ', line => {
    try {
      console.log(rep(line));
    } catch (e) {
      console.log(e);;
    }
    repl();
  });

repl();
