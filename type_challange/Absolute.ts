/**
 * Question
 * Implement the Absolute type. A type that take string, number or bigint. The output should be a positive number string
 */

// Answer
type Absolute<N> = N extends infer UN
  ? UN extends number | bigint
    ? `${UN}` extends `${infer S}${infer V}`
      ? S extends '-'
        ? V
        : UN
      : never
    : never
  : never;
type TestAbs = -100;
type ResultAbs = Absolute<TestAbs>; // expected to be "100"
