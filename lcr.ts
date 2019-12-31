import { usolve } from 'mathjs';
import _ from 'lodash';

type PositionChips = number[];

type GameParameters = {
  winnerPosition: number; // zero-based
  chipsAtPosition: PositionChips;
};

type GameState = {
  turn: number; // zero-based
  chipsAtPosition: PositionChips;
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
  return state.chipsAtPosition.filter(Boolean).length === 1;
};

const cartesianProduct = (arrays: any[][]): any[][] =>
  _.reduce(
    arrays,
    (a, b) => _.flatten(_.map(a, x => _.map(b, y => (x as any[]).concat([y])))),
    [[]]
  );

const getPossibleRolls = (state: GameState): Roll[] => {
  const numChips = state.chipsAtPosition[state.turn];

  return cartesianProduct(
    new Array(numChips).fill([Die.Left, Die.Center, Die.Right, Die.Dot])
  );
};

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const getNextTurn = (currentTurn: number, nextChips: PositionChips): number => {
  const numPositions = nextChips.length;

  const adjacentTurn = mod(currentTurn + 1, numPositions);

  // console.log('gNT', currentTurn, nextChips, adjacentTurn);

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

const printDie = (die: Die): string => {
  switch (die) {
    case Die.Left:
      return 'L';
    case Die.Center:
      return 'C';
    case Die.Right:
      return 'R';
    case Die.Dot:
      return '.';
  }
};

const printRoll = (roll: Roll): string => {
  return roll.map(printDie).join('');
};

const getNextState = (currentState: GameState, roll: Roll): GameState => {
  console.log('gNS', printState(currentState), printRoll(roll));
  const nextChips = roll.reduce(
    moveChip(currentState.turn),
    currentState.chipsAtPosition
  );
  console.log('gNS nextChips', nextChips);
  const nextTurn = getNextTurn(currentState.turn, nextChips);
  console.log('gNS nextTurn', nextTurn);

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
  console.log('gSE rolls', rolls.map(printRoll));

  const expression = rolls.map(roll => ({
    state: getNextState(state, roll),
    probability: getRollProbability(roll)
  }));
  console.log(
    'gSE expr',
    expression.map(e => [printState(e.state), e.probability])
  );

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
    .map(expr => `${_.round(expr.probability, 2)}*${printState(expr.state)}`)
    .join('+')}`;
};

const getEquations = (state: GameState, prevEqs: Equation[]): Equation[] => {
  console.log('gEqs', printState(state), prevEqs.map(printEq));
  if (isEndingState(state)) {
    console.log('isEnding');
    return prevEqs;
  }

  if (prevEqs.some(eq => _.isEqual(state, eq.state))) {
    console.log('isPrev');
    return prevEqs;
  }

  const currentStateEquation = getSingleEquation(state);
  console.log(
    'curr state:',
    printState(state),
    'eq expr:',
    printEq(currentStateEquation)
  );

  const nextStates = _.map(currentStateEquation.expression, 'state');
  console.log(
    'curr state:',
    printState(state),
    'next:',
    nextStates.map(printState)
  );

  return getRemainingEquations(nextStates, [currentStateEquation, ...prevEqs]);
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
