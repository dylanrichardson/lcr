import _ from 'lodash';

export const cartesianProduct = (arrays: any[][]): any[][] =>
  _.reduce(
    arrays,
    (a, b) => _.flatten(_.map(a, x => _.map(b, y => (x as any[]).concat([y])))),
    [[]]
  );

export const mod = (n: number, m: number): number => ((n % m) + m) % m;
