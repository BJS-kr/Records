/**
 * Question
 * Implement Trim<T> which takes an exact string type and returns a new string with the whitespace from both ends removed.
 */

// Answer
type Trim<S extends string> = S extends
  | `${' ' | '\n' | '\t'}${infer R}`
  | `${infer R}${' ' | '\n' | '\t'}`
  ? Trim<R>
  : S;
type trimmed = Trim<'  Hello World  '>; // expected to be 'Hello World'
