import { isResourceLinkage } from './isResourceLinkage';

import type { JSONAPIRelationshipObject } from '../../types/relationshipObject';

export const isRelationshipObject = (
  relationshipObjectCandidate: unknown,
): relationshipObjectCandidate is JSONAPIRelationshipObject => {
  if (relationshipObjectCandidate === null) {
    return false;
  }

  if (typeof relationshipObjectCandidate !== 'object') {
    return false;
  }

  if (!('data' in relationshipObjectCandidate)) {
    return false;
  }

  const { data } = relationshipObjectCandidate;

  return isResourceLinkage(data);
};
