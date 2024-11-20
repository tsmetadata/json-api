import type { JSONObject } from './json';
import type { JSONAPIRelationshipObject } from './relationshipObject';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIRelationshipsObject = Satisfies<
  { [key: string]: JSONAPIRelationshipObject },
  JSONObject
>;
