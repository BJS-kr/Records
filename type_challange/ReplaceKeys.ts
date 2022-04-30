/**
 * Question
 * Implement a type ReplaceKeys, that replace keys in union types, if some type has not this key, just skip replacing, A type takes three arguments.
 */

// Answer
type ReplaceKeys<T, K extends string | symbol | number, S> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
} & S;

type NodeA = {
  type: 'A';
  name: string;
  flag: number;
};

type NodeB = {
  type: 'B';
  id: number;
  flag: number;
};

type NodeC = {
  type: 'C';
  name: string;
  flag: number;
};

type Nodes = NodeA | NodeB | NodeC;

type ReplacedNodes = ReplaceKeys<
  Nodes,
  'name' | 'flag',
  { name: number; flag: string }
>; // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.
const replaceNodes: ReplacedNodes = { type: 'A', name: 1, flag: '' };

type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', { aa: number }>; // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never
const replaceNotExistKeys_A: ReplacedNotExistKeys = {
  type: 'A',
  flag: 1,
  aa: 1,
};
const replaceNotExistKeys_B: ReplacedNotExistKeys = {
  type: 'B',
  flag: 1,
  aa: 1,
  id: 1,
};
