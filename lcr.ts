import _ from 'lodash';
import { GameParameters } from './types';
import { calculateProbability } from './probability';

export const getProblemParameters = (): GameParameters => {
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
    `The probability of position ${winnerPosition} winning is ${_.round(
      probability,
      5
    )}%.`
  );
};

main();
