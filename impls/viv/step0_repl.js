const { stdin, stdout} = process;

const READ = str => str; 
const EVAL = str => str; 
const PRINT = str => str; 
const rep = str => PRINT(EVAL(READ(str))); 

stdin.setEncoding('utf-8');
stdout.setEncoding('utf-8');

stdout.write('user> ');

stdin.on('data', chunk => {
  stdout.write(rep(chunk));
  stdout.write('user> ');
});