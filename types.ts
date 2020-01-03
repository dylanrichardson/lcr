import _ from 'lodash';

export type PositionChips = number[];

export class GameState {
  hash: string;

  constructor(public turn: number, public chipsAtPosition: PositionChips) {
    this.hash = `${turn}${chipsAtPosition.join('')}`;
  }
}

export class Term {
  hash: string;

  constructor(public probability: number, public state: GameState) {
    this.hash = `${state.hash}${probability}`;
  }
}

export class Expression {
  hash: string;

  constructor(public terms: Term[]) {
    this.hash = _.map(terms, 'hash').join('');
  }
}

export class Equation {
  hash: string;

  constructor(public state: GameState, public expression: Expression) {
    this.hash = `${state.hash}${expression.hash}`;
  }
}

export enum Die {
  Left,
  Center,
  Right,
  Dot
}

export type Roll = Die[];
