import { assertMetadataIsPresent } from '../../../src/serializers/utils/assertMetadataIsPresent';

describe('`assertMetadataIsPresent`', () => {
  it('should throw an error if `Symbol.metadata` is undefined', () => {
    const originalSymbolMetadata = Symbol.metadata;

    // @ts-expect-error
    Symbol.metadata = undefined;

    try {
      assertMetadataIsPresent({});
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Failed to assert the presence of metadata because the metadata symbol is undefined. You may need to import the `@tsmetadata/polyfill` package.',
      );
    }

    // @ts-expect-error
    Symbol.metadata = originalSymbolMetadata;
  });

  describe('when the candidate is an array of objects', () => {
    it('should throw an error if at least one candidate is not an object', () => {
      const candidate = [1, {}];

      try {
        assertMetadataIsPresent(candidate);
      } catch (error) {
        expect((error as Error).message).toEqual(
          'Failed to assert the presence of metadata because at least one candidate is not an object, meaning no constructor is present.',
        );
      }
    });

    it('should throw an error if no metadata is found on an object constructor', () => {
      const candidate = [{}, {}];

      try {
        assertMetadataIsPresent(candidate);
      } catch (error) {
        expect((error as Error).message).toEqual(
          'No metadata was found on an object constructor.',
        );
      }
    });

    it('should return `true` if metadata is found on all object constructors', () => {
      const candidate = [
        { constructor: { [Symbol.metadata]: 'metadata' } },
        { constructor: { [Symbol.metadata]: 'metadata' } },
      ];

      expect(assertMetadataIsPresent(candidate)).toBe(true);
    });
  });

  describe('when the candidate is an object', () => {
    it('should throw an error if the candidate is not an object', () => {
      const candidate = 1;

      try {
        assertMetadataIsPresent(candidate);
      } catch (error) {
        expect((error as Error).message).toEqual(
          'Failed to assert the presence of metadata because at least one candidate is not an object, meaning no constructor is present.',
        );
      }
    });

    it('should throw an error if no metadata is found on the object constructor', () => {
      const candidate = {};

      try {
        assertMetadataIsPresent(candidate);
      } catch (error) {
        expect((error as Error).message).toEqual(
          'No metadata was found on an object constructor.',
        );
      }
    });

    it('should return `true` if metadata is found on the object constructor', () => {
      const candidate = { constructor: { [Symbol.metadata]: 'metadata' } };

      expect(assertMetadataIsPresent(candidate)).toBe(true);
    });
  });
});
