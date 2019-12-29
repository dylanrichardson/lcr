// TODO: make struct with chips, position, and isTurn

const getParameters = () => {
  const {
    argv: [, , winnerStr, ...chipsStrs]
  } = process;

  const winner = parseInt(winnerStr);
  const chips = chipsStrs.map(chipsStr => parseInt(chipsStr));

  if (!Number.isInteger(winner)) {
    throw new Error('Error: <winner> must be an integer.');
  }

  if (chips.length < winner) {
    throw new Error(
      'Error: Length of <chips>... must be greater than or equal to <winner>.'
    );
  }

  if (!chips.every(Number.isInteger)) {
    throw new Error('Error: <chips>... must be a list of integers.');
  }

  return { winner, chips };
};

const calculateProbability = (winner, chips) => {
  // TODO: implement
};

const main = () => {
  const { winner, chips } = getParameters();

  const probability = calculateProbability(winner, chips);

  chips.forEach((c, i) =>
    console.log(`Position ${i + 1} starts with ${c} chip(s).`)
  );
  console.log(
    `The probability of position ${winner} winning is ${probability}%.`
  );
};

main();
