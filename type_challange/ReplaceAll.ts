/**
 * Question
 * Implement ReplaceAll<S, From, To> which replace the all the substring From with To in the given string S
 */
// Answer
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer Pre}${From}${infer Suf}`
  ? ReplaceAll<`${Pre}${To}${Suf}`, From, To>
  : S;

type replaceAll = ReplaceAll<'t y p e s', ' ', ''>; // expected to be 'types'
