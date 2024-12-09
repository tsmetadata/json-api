import { isRelationshipObject } from '../../../src/serializers/utils/isRelationshipObject';
import { isResourceLinkage } from '../../../src/serializers/utils/isResourceLinkage';

jest.mock('../../../src/serializers/utils/isResourceLinkage');
const isResourceLinkageMocked = jest.mocked(isResourceLinkage);

describe('`isRelationshipObject`', () => {
  it('should return false if `relationshipObjectCandidate` is `null`', () => {
    const relationshipObjectCandidate = null;

    expect(isRelationshipObject(relationshipObjectCandidate)).toBe(false);
  });

  it('should return false if `relationshipObjectCandidate` is not an object', () => {
    const relationshipObjectCandidate = 'not an object';

    expect(isRelationshipObject(relationshipObjectCandidate)).toBe(false);
  });

  it('should return false if `relationshipObjectCandidate` does not have a `data` property', () => {
    const relationshipObjectCandidate = {};

    expect(isRelationshipObject(relationshipObjectCandidate)).toBe(false);
  });

  it('should return true if `relationshipObjectCandidate.data` is a `JSONAPIResourceLinkage`', () => {
    isResourceLinkageMocked.mockReturnValue(true);

    const relationshipObjectCandidate = {
      data: 'foo',
    };

    expect(isRelationshipObject(relationshipObjectCandidate)).toBe(true);
  });
});
