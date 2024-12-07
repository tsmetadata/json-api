import { isResourceIdentifierObject } from '../../../src/serializers/utils/isResourceIdentifierObject';

describe('`isResourceIdentifierObject`', () => {
  it('it should return `false` if `resourceIdentifierObjectCandidate` is null', () => {
    const resourceIdentifierObjectCandidate = null;

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `false` if `resourceIdentifierObjectCandidate` is not an object', () => {
    const resourceIdentifierObjectCandidate = 'not an object';

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `false` if `resourceIdentifierObjectCandidate` is an array', () => {
    const resourceIdentifierObjectCandidate: unknown[] = [];

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `false` if `resourceIdentifierObjectCandidate` does not have a `type` property', () => {
    const resourceIdentifierObjectCandidate = {
      id: '1',
    };

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `false` if `resourceIdentifierObjectCandidate.type` is not a string', () => {
    const resourceIdentifierObjectCandidate = {
      type: 1,
      id: '1',
    };

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `false` if `resourceIdentifierObjectCandidate` does not have an `id` property', () => {
    const resourceIdentifierObjectCandidate = {
      type: 'test',
    };

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `false` if `resourceIdentifierObjectCandidate.id` is not a string', () => {
    const resourceIdentifierObjectCandidate = {
      type: 'test',
      id: 1,
    };

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      false,
    );
  });

  it('it should return `true` if `resourceIdentifierObjectCandidate` is a valid JSON:API Resource Identifier Object', () => {
    const resourceIdentifierObjectCandidate = {
      type: 'test',
      id: '1',
    };

    expect(isResourceIdentifierObject(resourceIdentifierObjectCandidate)).toBe(
      true,
    );
  });
});
