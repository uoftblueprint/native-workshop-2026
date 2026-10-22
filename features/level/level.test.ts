import { calculateLevelDegrees, isLevel } from './level';

function expectNear(actual: number, expected: number, message: string) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > 0.05) {
    throw new Error(`${message}\nExpected about ${expected}, received ${actual}.`);
  }
}

function check(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

describe('calculateLevelDegrees', () => {
  it('turns a flat angle into 0 degrees', () => {
    expectNear(calculateLevelDegrees(0), 0, '0 radians should be 0 degrees.');
  });

  it('turns a right angle into 90 degrees', () => {
    expectNear(
      calculateLevelDegrees(Math.PI / 2),
      90,
      'A quarter turn in radians should become 90 degrees.',
    );
  });

  it('keeps the sign of the tilt', () => {
    expectNear(
      calculateLevelDegrees(-Math.PI / 4),
      -45,
      'A negative radian tilt should stay negative. Left and right are different directions.',
    );
  });
});

describe('isLevel', () => {
  it('treats 0 degrees as level', () => {
    check(isLevel(0), '0 degrees should count as level.');
  });

  it('treats a small tilt as level', () => {
    check(
      isLevel(1.5),
      'Expected a small tilt like 1.5 degrees to count as level. Check the tolerance used in isLevel().',
    );
    check(
      isLevel(-1.5),
      'Level should work on both sides of 0. -1.5 degrees is still close enough.',
    );
  });

  it('does not treat a clear tilt as level', () => {
    check(!isLevel(8), '8 degrees is tilted. It should not count as level.');
    check(!isLevel(-8), '-8 degrees is tilted. It should not count as level.');
  });
});
