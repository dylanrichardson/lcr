export type PositionChips = number[];

export type GameState = {
  turn: number; // zero-based
  chipsAtPosition: PositionChips;
};

export type Term = {
  probability: number;
  state: GameState;
};

export type Expression = Term[];

export type Equation = {
  state: GameState;
  expression: Expression;
};

export enum Die {
  Left,
  Center,
  Right,
  Dot
}

export type Roll = Die[];
