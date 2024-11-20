import type { JSONAPIResourceIdentifierObject } from './resourceIdentifierObject';

export type JSONAPIResourceLinkage =
  | JSONAPIResourceIdentifierObject
  | JSONAPIResourceIdentifierObject[]
  | null;
