import { isResourceLinkage } from '../../../src/serializers/utils/isResourceLinkage';

import { isResourceIdentifierObject } from '../../../src/serializers/utils/isResourceIdentifierObject';

jest.mock('../../../src/serializers/utils/isResourceIdentifierObject');

const isResourceIdentifierObjectMocked = jest.mocked(
  isResourceIdentifierObject,
);

describe('`isResourceLinkage`', () => {
  it('should return true if `resourceLinkageCandidate` is `null`', () => {
    const resourceLinkageCandidate = null;

    expect(isResourceLinkage(resourceLinkageCandidate)).toBe(true);
  });

  it('should return true if `resourceLinkageCandidate` is an array of `JSONAPIResourceIdentifierObject`', () => {
    isResourceIdentifierObjectMocked.mockReturnValue(true);

    const resourceLinkageCandidate = ['foo', 'bar'];

    expect(isResourceLinkage(resourceLinkageCandidate)).toBe(true);
  });

  it('should return true if `resourceLinkageCandidate` is a `JSONAPIResourceIdentifierObject`', () => {
    isResourceIdentifierObjectMocked.mockReturnValue(true);

    const resourceLinkageCandidate = 'foo';

    expect(isResourceLinkage(resourceLinkageCandidate)).toBe(true);
  });
});
