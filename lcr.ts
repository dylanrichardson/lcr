interface GameState {
  turn: number;
  chips: number[];
}

interface Variable {
  state: GameState;
  winningState: GameState;
}

type Term = number | Record<number, Variable>;

type Equation = Term[];

enum Die {
  Left,
  Center,
  Right,
  Dot
}

const dieProbability = {
  [Die.Left]: 1 / 6,
  [Die.Center]: 1 / 6,
  [Die.Right]: 1 / 6,
  [Die.Dot]: 1 / 2
};

const getParameters = () => {
  const {
    argv: [, , winnerStr, ...chipsStrs]
  } = process;

  const winner = parseInt(winnerStr) - 1;
  const chips = chipsStrs.map(chipsStr => parseInt(chipsStr));

  if (!Number.isInteger(winner)) {
    throw new Error('Error: <winner> must be an integer.');
  }

  if (chips.length < winner + 1) {
    throw new Error(
      'Error: Length of <chips>... must be greater than or equal to <winner>.'
    );
  }

  if (!chips.every(Number.isInteger)) {
    throw new Error('Error: <chips>... must be a list of integers.');
  }

  return { winner, chips };
};

const getWinningStates = (
  winnerPos: number,
  numPlayers: number,
  numChips: number
): GameState[] => {
  const players = new Array(numPlayers).fill(0);

  return new Array(numChips).fill(0).map((_, chipIdx) => ({
    turn: winnerPos,
    chips: players.map((_, idx) => (idx === winnerPos ? chipIdx + 1 : 0))
  }));
};

const getEquations = (): Equation[] => {
  // TODO:
  return [];
};

const solve = (eqs: Equation[]): number => {
  // TODO:
  return NaN;
};

const sum = (l: number[]) => l.reduce((a, b) => a + b);

const calculateProbability = (winner: number, { turn, chips }: GameState) => {
  const winningStates = getWinningStates(winner, chips.length, sum(chips));
  console.log('winning states', winningStates);

  const eqs = getEquations();

  return solve(eqs);
};

const main = () => {
  const { winner, chips } = getParameters();

  const probability = calculateProbability(winner, { turn: 0, chips });

  chips.forEach((c, i) =>
    console.log(`Position ${i + 1} starts with ${c} chip(s).`)
  );
  console.log(
    `The probability of position ${winner} winning is ${probability}%.`
  );
};

main();
