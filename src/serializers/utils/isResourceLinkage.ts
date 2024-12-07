import { isResourceIdentifierObject } from './isResourceIdentifierObject';

import type { JSONAPIResourceLinkage } from '../../types/resourceLinkage';

export const isResourceLinkage = (
  resourceLinkageCandidate: unknown,
): resourceLinkageCandidate is JSONAPIResourceLinkage => {
  if (resourceLinkageCandidate === null) {
    return true;
  }

  if (Array.isArray(resourceLinkageCandidate)) {
    return resourceLinkageCandidate.every(isResourceIdentifierObject);
  }

  return isResourceIdentifierObject(resourceLinkageCandidate);
};
