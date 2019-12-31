import { usolve } from 'mathjs';
import _ from 'lodash';
import { PositionChips, GameState, Equation, Die, Roll } from './types';
import { printEq } from './logging';
import { cartesianProduct, mod } from './utils';

const isWinningState = (winnerPosition: number, state: GameState): boolean => {
  // TODO:
  return false;
};

const isLosingState = (winnerPosition: number, state: GameState): boolean => {
  // TODO:
  return false;
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

const getMatrix = (
  winnerPosition: number,
  eqs: Equation[]
): [number[][], number[]] => {
  // TODO: isWinningState, isLosingState
  return [
    [
      [1, 2],
      [2, 1]
    ],
    [1, 2]
  ];
};

export const calculateProbability = (
  winnerPosition: number,
  state: GameState
): number => {
  const eqs = getEquations(state, []);
  console.log('eqs:', eqs.map(printEq));

  const [matrix, vector] = getMatrix(winnerPosition, eqs);

  const probabilities = usolve(matrix, vector) as number[];

  return probabilities[winnerPosition];
};
