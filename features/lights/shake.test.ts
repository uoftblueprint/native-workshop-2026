import { isShake } from './shake';

function check(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

describe('isShake', () => {
  it('does not treat a still phone as a shake', () => {
    check(!isShake(0, 0, 1), 'A phone sitting still should not count as a shake. Gravity alone is about 1.');
  });

  it('does not treat a small movement as a shake', () => {
    check(!isShake(0.3, -0.2, 0.95), 'A small movement should not count as a shake.');
  });

  it('does not treat a light bump on one axis as a shake', () => {
    check(!isShake(1.6, 0.1, 0.1), 'A light bump on one axis should not count as a shake.');
  });

  it('treats a hard shake across the axes as a shake', () => {
    check(
      isShake(1.4, -1.3, 1.2),
      'That reading is a real shake spread across x, y, and z. Square each value, add the squares, take the square root, and compare that with a threshold above normal gravity. A negative axis still counts.',
    );
  });
});
