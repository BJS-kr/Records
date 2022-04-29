/**
 * Question
 * Implement the String to Union type. Type take string argument. The output should be a union of input letters
 */

// Answer
type StringToUnion<T> = T extends `${infer P}${infer S}`
  ? P | StringToUnion<S>
  : never;
type TestS2U = '123';
type ResultS2U = StringToUnion<TestS2U>; // expected to be "1" | "2" | "3"
