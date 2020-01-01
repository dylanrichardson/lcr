import _ from 'lodash';
import { isWinningState, isEndingState } from './probability';
import { Die, Roll, GameState, Equation, Expression } from './types';

export const printDie = (die: Die): string => {
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

export const printRoll = (roll: Roll): string => {
  return roll.map(printDie).join('');
};

// const sn = (state: GameState): string => {
//   if (isWinningState(2, state)) {
//     return '1';
//   }
//   if (isEndingState(state)) {
//     return '0';
//   }
//   return 's' + state.turn + state.chipsAtPosition.join('');
// };

export const printState = ({ turn, chipsAtPosition }: GameState): string => {
  // return sn({ turn, chipsAtPosition });
  const chipStrs = chipsAtPosition.map(_.toString);
  chipStrs[turn] = `(${chipStrs[turn]})`;
  return chipStrs.join('');
};

export const printExpression = (expr: Expression): string => {
  return expr
    .map(
      ({ probability, state }) =>
        `${_.round(probability, 2)}*${printState(state)}`
    )
    .join('+');
};

export const printEq = ({ state, expression }: Equation): string => {
  return `${printState(state)}=${printExpression(expression)}`;
};
