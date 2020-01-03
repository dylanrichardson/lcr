import { lusolve } from 'mathjs';
import _ from 'lodash';
import {
  PositionChips,
  GameState,
  Term,
  Expression,
  Equation,
  Die,
  Roll
} from './types';
import { cartesianProduct, mod } from './utils';

const isWinningState = _.memoize(
  (winnerPosition: number, state: GameState): boolean =>
    isEndingState(state) && state.chipsAtPosition[winnerPosition] > 0,
  (wp, { hash }) => `${wp}${hash}`
);

const isEndingState = _.memoize(
  ({ chipsAtPosition }: GameState): boolean =>
    chipsAtPosition.filter(Boolean).length === 1,
  ({ hash }) => hash
);

let c = 0;
const getPossibleRollsByDice = _.memoize((numDice: number): Roll[] =>
  cartesianProduct(
    new Array(numDice).fill([Die.Left, Die.Center, Die.Right, Die.Dot])
  )
);

// TODO: remove redundant rolls
const getPossibleRollsByState = (state: GameState): Roll[] => {
  const numChips = state.chipsAtPosition[state.turn];

  return getPossibleRollsByDice(Math.min(numChips, 3));
};

const getNextTurn = _.memoize(
  (currentTurn: number, nextChips: PositionChips): number => {
    const numPositions = nextChips.length;

    const adjacentTurn = mod(currentTurn + 1, numPositions);

    return nextChips[adjacentTurn]
      ? adjacentTurn
      : getNextTurn(adjacentTurn, nextChips);
  },
  (ct, nc) => `${ct}${nc.join('')}`
);

const moveChip = (turn: number) => (
  currentChips: PositionChips,
  die: Die
): PositionChips => {
  const numPositions = currentChips.length;
  const nextChips = [...currentChips];

  switch (die) {
    case Die.Left:
      nextChips[turn]--;
      nextChips[mod(turn + 1, numPositions)]++;
      break;
    case Die.Center:
      nextChips[turn]--;
      break;
    case Die.Right:
      nextChips[turn]--;
      nextChips[mod(turn - 1, numPositions)]++;
      break;
    case Die.Dot:
      break;
  }

  return nextChips;
};

const getNextState = (currentState: GameState, roll: Roll): GameState => {
  const nextChips = roll.reduce(
    moveChip(currentState.turn),
    currentState.chipsAtPosition
  );

  const nextTurn = getNextTurn(currentState.turn, nextChips);

  return new GameState(nextTurn, nextChips);
};

const dieProbability = {
  [Die.Left]: 1 / 6,
  [Die.Center]: 1 / 6,
  [Die.Right]: 1 / 6,
  [Die.Dot]: 1 / 2
};

const getRollProbability = _.memoize(
  (roll: Roll): number =>
    roll.reduce((product, die) => product * dieProbability[die], 1),
  r => r.join('')
);

const getSingleEquation = (state: GameState): Equation => {
  const rolls = getPossibleRollsByState(state);

  const expression = new Expression(
    rolls.map(
      roll => new Term(getRollProbability(roll), getNextState(state, roll))
    )
  );

  return new Equation(state, expression);
};

const getRemainingEquations = (
  states: GameState[],
  prevEqs: Equation[]
): Equation[] => {
  return states.reduce((eqs, state) => getEquations(state, eqs), prevEqs);
};

const getEquations = (state: GameState, prevEqs: Equation[]): Equation[] => {
  if (isEndingState(state)) {
    return prevEqs;
  }

  if (prevEqs.some(eq => _.isEqual(state, eq.state))) {
    return prevEqs;
  }

  console.log('c', ++c);
  const currentStateEquation = getSingleEquation(state);

  const nextStates = _.map(currentStateEquation.expression.terms, 'state');

  return getRemainingEquations(nextStates, [...prevEqs, currentStateEquation]);
};

const getExpressionMap = _.memoize(
  (expr: Expression): Map<string, number> => {
    const map = new Map<string, number>();

    expr.terms.forEach(({ state: { hash }, probability }) => {
      map.set(hash, probability + (map.get(hash) || 0));
    });

    return map;
  },
  ({ hash }) => hash
);

const getZeroSumExpression = ({ state, expression }: Equation): Expression => {
  return new Expression([...expression.terms, new Term(-1, state)]);
};

const getRow = (winnerPosition: number, nonEndingStates: GameState[]) => (
  eq: Equation
): [number[], number] => {
  const expression = getZeroSumExpression(eq);

  const nonEndingStateProbabilitiesMap = getExpressionMap(
    new Expression(
      expression.terms.filter(({ state }) => !isEndingState(state))
    )
  );

  const winningStateProbability = _.sum(
    expression.terms
      .filter(({ state }) => isWinningState(winnerPosition, state))
      .map(({ probability }) => probability)
  );

  const nonEndingStateProbabilities = nonEndingStates.map(
    state => nonEndingStateProbabilitiesMap.get(state.hash) || 0
  );

  return [nonEndingStateProbabilities, -winningStateProbability];
};

const getMatrix = (
  winnerPosition: number,
  eqs: Equation[]
): [number[][], number[]] => {
  const nonEndingStates = _.map(eqs, 'state');

  // TODO: rename
  const x = eqs.map(getRow(winnerPosition, nonEndingStates));

  return [x.map(([y]) => y), x.map(([, y]) => y)];
};

const calculateProbability = (startingState: GameState, eqs: Equation[]) => (
  winnerPosition: number
): number => {
  const nonEndingStates = _.map(eqs, 'state');

  const startingEqPosition = _.findIndex(nonEndingStates, startingState);

  const [matrix, vector] = getMatrix(winnerPosition, eqs);

  const probabilities = lusolve(matrix, vector) as number[];

  console.log('prob');
  return probabilities[startingEqPosition];
};

export const calculateProbabilities = (startingState: GameState): number[] => {
  const eqs = getEquations(startingState, []);
  console.log('eqs');

  const positions = _.range(startingState.chipsAtPosition.length);

  return positions.map(calculateProbability(startingState, eqs));
};
