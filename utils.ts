import _ from 'lodash';

export const cartesianProduct = <T>(arrays: T[][]): T[][] =>
  _.reduce(
    arrays,
    (a, b) => _.flatten(_.map(a, x => _.map(b, y => (x as T[]).concat([y])))),
    [[]]
  );

export const mod = (n: number, m: number): number => ((n % m) + m) % m;
