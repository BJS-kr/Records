/**
 * Question
 * Compute the length of a string literal, which behaves like String#length.
 */

// Answer

type StringLength<S extends string> = S extends `${infer Start}${infer End}`
  ? [Start, StringLength<End>]
  : never;
type StringLengthMeasured = StringLength<'hello'>;
