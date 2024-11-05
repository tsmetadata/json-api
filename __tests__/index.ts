import '../src/index';

describe('`index`', () => {
  it('should have imported `@tsmetadata/polyfill`', () => {
    expect(Object.hasOwn(Symbol, 'metadata')).toBe(true);
  });
});
