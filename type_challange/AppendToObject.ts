/**
 * Implement a type that adds a new field to the interface. The type takes the three arguments. The output should be an object with the new field.
 */

// Answer
type AppendToObject<T, TK extends string, TV> = T & { [K in TK]: TV };

type Tested = { id: '1' };
type ResultA2O = AppendToObject<Tested, 'value', 4>; // expected to be { id: '1', value: 4 }
const resultA2O: ResultA2O = { id: '1', value: 4 };
