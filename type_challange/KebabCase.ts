/**
 * Question
 * make "FooBarBaz" to "foo-bar-baz"
 */

// Answer
type CapitalToLower = {
  F: 'f';
  B: 'b';
};

type MakeFirstCharLower<S> = S extends `${infer FC}${infer R}`
  ? FC extends keyof CapitalToLower
    ? `${CapitalToLower[FC]}${R}`
    : `${FC}${R}`
  : never;

type MakeKebab<S> = S extends `${infer FC}${infer R}`
  ? FC extends keyof CapitalToLower
    ? MakeKebab<`-${CapitalToLower[FC]}${R}`>
    : `${FC}${MakeKebab<R>}`
  : '';

type KebabCase<S> = MakeKebab<MakeFirstCharLower<S>>;

type Kebab = KebabCase<'FooBarBaz'>; // "foo-bar-baz"
