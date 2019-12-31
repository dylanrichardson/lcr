import { usolve } from 'mathjs';
import 'lodash.product';
import _ from 'lodash';

type GameParameters = {
  winnerPosition: number; // zero-based
  chipsAtPosition: number[];
};

type GameState = {
  turn: number; // zero-based
  chipsAtPosition: number[];
};

type Term = {
  probability: number;
  state: GameState;
};

type Expression = Term[];

type Equation = {
  state: GameState;
  expression: Expression;
};

enum Die {
  Left,
  Center,
  Right,
  Dot
}

type Roll = Die[];

const getProblemParameters = (): GameParameters => {
  const {
    argv: [, , winnerStr, ...positionChipsStrs]
  } = process;

  const winnerPosition = parseInt(winnerStr) - 1;
  const chipsAtPosition = _.map(positionChipsStrs, _.parseInt);

  if (!_.isInteger(winnerPosition)) {
    throw new Error('Error: <winner> must be an integer.');
  }

  if (chipsAtPosition.length <= winnerPosition) {
    throw new Error(
      'Error: Length of <chips>... must be greater than or equal to <winner>.'
    );
  }

  if (!chipsAtPosition.every(_.isInteger)) {
    throw new Error('Error: <chips>... must be a list of integers.');
  }

  return { winnerPosition, chipsAtPosition };
};

const isWinningState = (winnerPosition: number, state: GameState): boolean => {
  // TODO:
  return false;
};

const isLosingState = (winnerPosition: number, state: GameState): boolean => {
  // TODO:
  return false;
};

const isEndingState = (state: GameState): boolean => {
  // TODO:
  return false;
};

const getRolls = (state: GameState): Roll[] => {
  // TODO: _.product
  return [];
};

const getNextState = (state: GameState) => (roll: Roll): GameState => {
  // TODO:
  return state;
};

const dieProbability = {
  [Die.Left]: 1 / 6,
  [Die.Center]: 1 / 6,
  [Die.Right]: 1 / 6,
  [Die.Dot]: 1 / 2
};

const getRollProbability = (roll: Roll): number => {
  // TODO: dieProbability
  return 0;
};

const getSingleEquation = (state: GameState): Equation => {
  const rolls = getRolls(state);

  const expression = rolls.map(roll => ({
    state: getNextState(state)(roll),
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

const printState = ({ turn, chipsAtPosition }: GameState): string => {
  const chipStrs = chipsAtPosition.map(_.toString);
  chipStrs[turn] = `(${chipStrs[turn]})`;
  return chipStrs.join('');
};

const printEq = ({ state, expression }: Equation): string => {
  return `${printState(state)}=${expression
    .map(expr => `${expr.probability}*${printState(expr.state)}`)
    .join('+')}`;
};

const getEquations = (state: GameState, prevEqs: Equation[]): Equation[] => {
  if (isEndingState(state)) {
    return prevEqs;
  }

  if (prevEqs.some(eq => _.isEqual(state, eq.state))) {
    return prevEqs;
  }

  const currentStateEquation = getSingleEquation(state);
  console.log(
    'curr state:',
    printState(state),
    'eq:',
    printEq(currentStateEquation)
  );

  const nextStates = _.map(currentStateEquation.expression, 'state');
  console.log(
    'curr state:',
    printState(state),
    'next:',
    nextStates.map(printState)
  );

  const remainingEquations = getRemainingEquations(nextStates, prevEqs);

  return [currentStateEquation, ...remainingEquations];
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

const calculateProbability = (
  winnerPosition: number,
  state: GameState
): number => {
  const eqs = getEquations(state, []);
  console.log('eqs:', eqs.map(printEq));

  const [matrix, vector] = getMatrix(winnerPosition, eqs);

  const probabilities = usolve(matrix, vector) as number[];

  return probabilities[winnerPosition];
};

const main = () => {
  const { winnerPosition, chipsAtPosition } = getProblemParameters();

  chipsAtPosition.forEach((c, i) =>
    console.log(`Position ${i + 1} starts with ${c} chip(s).`)
  );

  const probability = calculateProbability(winnerPosition, {
    turn: 0,
    chipsAtPosition
  });

  console.log(
    `The probability of position ${winnerPosition} winning is ${probability}%.`
  );
};

main();
