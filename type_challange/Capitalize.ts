/**
 * Question
 * Implement Capitalize<T> which converts the first letter of a string to uppercase and leave the rest as-is.
 */

// Answer
type Chars = {
  a: 'A';
  b: 'B';
  c: 'C';
  d: 'D';
  e: 'E';
  f: 'F';
  g: 'G';
  h: 'H';
  i: 'I';
  j: 'J';
  k: 'K';
  l: 'L';
  m: 'M';
  n: 'N';
  o: 'O';
  p: 'P';
  q: 'Q';
  r: 'R';
  s: 'S';
  t: 'T';
  v: 'V';
  w: 'W';
  x: 'X';
  y: 'Y';
  z: 'Z';
};
type GetChar<T extends string> = keyof {
  [K in keyof Chars as K extends T ? Chars[K] : T];
};

type MyCapitalize<S extends string> = S extends `${infer R}${infer RR}`
  ? `${GetChar<R>}${RR}`
  : never;

type capitalized = MyCapitalize<'hello world'>; // expected to be 'Hello world'
