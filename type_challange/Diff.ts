/**
 * Question
 * Get an Object that is the difference between O & O1
 */

// Answer
type Diff<O1, O2> = {
  [K in keyof (O1 & O2) as K extends keyof O1
    ? K extends keyof O2
      ? never
      : K
    : K]: (O1 & O2)[K];
};

type Obj1 = { age: number; sex: string };
type Obj2 = { age: number; location: string };

type diff = Diff<Obj1, Obj2>; // { sex: string; location: string }
