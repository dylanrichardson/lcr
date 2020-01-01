# lcr

Calculate the probability of winning the game Left Center Right (LCR).

## Usage

```
lcr <chips>...
```

- **chips:** The number of starting chips for each position in order.

## Examples

Calculate the probability of each position winning out of 3 positions where each position starts with 3 chips:

```
lcr 3 3 3
```

Calculate the probability of each position winning out of 2 positions where the 1st position starts with 2 chips and the 2nd position starts with 1 chip:

```
lcr 2 1
```

## Install

```
yarn
```

## Build

```
yarn build
```

## Run

```
yarn start <args>...
```

or

```
node dist/lcr.js <args>...
```
