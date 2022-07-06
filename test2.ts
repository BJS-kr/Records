type HelloWorld = { hello: 'world' };

const hello = 'hello';
const helloWorld: HelloWorld = { [hello]: 'world' };

console.log(helloWorld); // { hello: 'world' }
