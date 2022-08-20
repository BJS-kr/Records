/**
 * ESModule evaluate exported variables as const variable
 *
 * for example,
 * in module_1.mjs: export let foo = 1;
 * in module_2.mjs that imports the foo variable: foo = 2 <- Error!
 *
 * so, it should reassigned inside the same module that variable was declared
 *
 * we can write function for those purpose
 *  */

// module_1.mjs
export let foo = 1;
export function reassignFoo(v) {
  foo = v;
}
// module_2.mjs
import { foo, reassignFoo } from './module_1';

foo = 2; // Error!
reassignFoo(4);

// reassigned!
console.log(foo); // 4
