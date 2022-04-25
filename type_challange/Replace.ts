/**
 * Question
 * Implement Replace<S, From, To> which replace the string From with To once in the given string S
 */

// Answer
type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : S;
type replaced = Replace<'types are fun!', 'fun', 'awesome'>; // expected to be 'types are awesome!'
