import _ from 'lodash';

export const mod = (n: number, m: number): number => ((n % m) + m) % m;

export const combsWithRep = <T>(n: number, lst: T[]): T[][] => {
  return n
    ? lst.length
      ? combsWithRep(n - 1, lst)
          .map(t => [lst[0]].concat(t))
          .concat(combsWithRep(n, lst.slice(1)))
      : []
    : [[]];
};

export const product = (l: number[]): number =>
  l.reduce((prod, n) => prod * n, 1);

export const factorial = _.memoize((n: number): number =>
  n ? n * factorial(n - 1) : 1
);
