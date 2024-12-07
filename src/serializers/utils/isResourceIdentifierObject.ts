import type { JSONAPIResourceIdentifierObject } from '../../types/resourceIdentifierObject';

export const isResourceIdentifierObject = (
  resourceIdentifierObjectCandidate: unknown,
): resourceIdentifierObjectCandidate is JSONAPIResourceIdentifierObject => {
  if (resourceIdentifierObjectCandidate === null) {
    return false;
  }

  if (
    typeof resourceIdentifierObjectCandidate !== 'object' ||
    Array.isArray(resourceIdentifierObjectCandidate)
  ) {
    return false;
  }

  if ('type' in resourceIdentifierObjectCandidate === false) {
    return false;
  }

  if (typeof resourceIdentifierObjectCandidate.type !== 'string') {
    return false;
  }

  if ('id' in resourceIdentifierObjectCandidate === false) {
    return false;
  }

  if (typeof resourceIdentifierObjectCandidate.id !== 'string') {
    return false;
  }

  return true;
};
