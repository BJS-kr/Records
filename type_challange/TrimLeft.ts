/**
 * Question
 * Implement TrimLeft<T> which takes an exact string type and returns a new string with the whitespace beginning removed.
 */

// Answer
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}`
  ? TrimLeft<R>
  : S;
type trimed = TrimLeft<'  Hello World  '>; // expected to be 'Hello World  '
