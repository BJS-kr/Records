/**
 * Question
 * Implement PercentageParser. According to the /^(\+|\-)?(\d*)?(\%)?$/ regularity to match T and get three matches.
 *
 *The structure should be: [plus or minus, number, unit] If it is not captured, the default is an empty string.
 */

// Answer
type Numeric = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
type PercentageParser<P, Parsed extends string[] = []> = P extends ''
  ? ['', '', '']
  : P extends `${infer S}${infer SS}`
  ? Parsed extends []
    ? S extends '+' | '-'
      ? PercentageParser<SS, [S]>
      : PercentageParser<SS, ['']>
    : P extends `${infer U}${infer UU}`
    ? U extends Numeric
      ? Parsed extends [infer E, ...infer EE]
        ? E extends string
          ? PercentageParser<UU, [E, `${EE extends [infer N] ? N : ''}${U}`]>
          : never
        : never
      : [...Parsed, `${U extends '%' ? '%' : ''}`]
    : [...Parsed, P]
  : never;

type PString1 = '';
type PString2 = '+85%';
type PString3 = '-85%';
type PString4 = '85%';
type PString5 = '85';

type R1 = PercentageParser<PString1>; // expected ['', '', '']
type R2 = PercentageParser<PString2>; // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3>; // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4>; // expected ["", "85", "%"]
type R5 = PercentageParser<PString5>; // expected ["", "85", ""]
