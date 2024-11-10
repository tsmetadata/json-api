import { isObject } from '../../../src/serializers/utils/isObject';

describe('`isObject`', () => {
  it('should return `false` when the value is `null`', () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return `false` when the value is not an object', () => {
    expect(isObject('')).toBe(false);
  });

  it('should return `true` when the value is an object', () => {
    expect(isObject({})).toBe(true);
  });
});
