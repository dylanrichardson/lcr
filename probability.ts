import { lusolve } from 'mathjs';
import _ from 'lodash';
import {
  PositionChips,
  GameState,
  Expression,
  Equation,
  Die,
  Roll
} from './types';
import { printState } from './logging';
import { cartesianProduct, mod } from './utils';

const isWinningState = (winnerPosition: number, state: GameState): boolean => {
  return isEndingState(state) && state.chipsAtPosition[winnerPosition] > 0;
};

const isEndingState = (state: GameState): boolean => {
  return state.chipsAtPosition.filter(Boolean).length === 1;
};

const getPossibleRolls = (state: GameState): Roll[] => {
  const numChips = state.chipsAtPosition[state.turn];

  return cartesianProduct(
    new Array(numChips).fill([Die.Left, Die.Center, Die.Right, Die.Dot])
  );
};

const getNextTurn = (currentTurn: number, nextChips: PositionChips): number => {
  const numPositions = nextChips.length;

  const adjacentTurn = mod(currentTurn + 1, numPositions);

  return nextChips[adjacentTurn]
    ? adjacentTurn
    : getNextTurn(adjacentTurn, nextChips);
};

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

  return { turn: nextTurn, chipsAtPosition: nextChips };
};

const dieProbability = {
  [Die.Left]: 1 / 6,
  [Die.Center]: 1 / 6,
  [Die.Right]: 1 / 6,
  [Die.Dot]: 1 / 2
};

const getRollProbability = (roll: Roll): number => {
  return roll.reduce((product, die) => product * dieProbability[die], 1);
};

const getSingleEquation = (state: GameState): Equation => {
  const rolls = getPossibleRolls(state);

  const expression = rolls.map(roll => ({
    state: getNextState(state, roll),
    probability: getRollProbability(roll)
  }));

  return { state, expression };
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

  const currentStateEquation = getSingleEquation(state);

  const nextStates = _.map(currentStateEquation.expression, 'state');

  return getRemainingEquations(nextStates, [...prevEqs, currentStateEquation]);
};

const getStateHash = (state: GameState): string => {
  return printState(state);
};

const getExpressionMap = (expr: Expression): Map<string, number> => {
  return new Map(
    expr.map(({ state, probability }) => [getStateHash(state), probability])
  );
};

const getZeroSumExpression = ({ state, expression }: Equation): Expression => {
  return [...expression, { state, probability: -1 }];
};

const getRow = (winnerPosition: number, nonEndingStates: GameState[]) => (
  eq: Equation
): [number[], number] => {
  // console.log('getRow', printState(eq.state), nonEndingStates.map(printState));
  const expression = getZeroSumExpression(eq);
  // console.log('0-sum expr', printExpression(expression));

  const nonEndingStateProbabilitiesMap = getExpressionMap(
    expression.filter(({ state }) => !isEndingState(state))
  );
  // console.log(nonEndingStateProbabilitiesMap);

  const winningStateProbability = _.sum(
    expression
      .filter(({ state }) => isWinningState(winnerPosition, state))
      .map(({ probability }) => probability)
  );

  const nonEndingStateProbabilities = nonEndingStates.map(
    state => nonEndingStateProbabilitiesMap.get(getStateHash(state)) || 0
  );
  // console.log('non end probs', nonEndingStateProbabilities);

  return [nonEndingStateProbabilities, -winningStateProbability];
};

const getMatrix = (
  winnerPosition: number,
  eqs: Equation[]
): [number[][], number[]] => {
  const nonEndingStates = _.map(eqs, 'state');

  const x = eqs.map(getRow(winnerPosition, nonEndingStates));

  return [x.map(([y]) => y), x.map(([, y]) => y)];
};

export const calculateProbability = (
  winnerPosition: number,
  startingState: GameState
): number => {
  const eqs = getEquations(startingState, []);
  // console.log('eqs:', eqs.map(printEq));

  const nonEndingStates = _.map(eqs, 'state');

  const winnerEqPosition = _.findIndex(nonEndingStates, startingState);

  const [matrix, vector] = getMatrix(winnerPosition, eqs);
  // console.log('matrix:', matrix, vector);

  const probabilities = lusolve(matrix, vector) as number[];
  // console.log('probs', probabilities);

  return probabilities[winnerEqPosition];
};
