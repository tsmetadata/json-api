import type { JSONObject } from './json/object';
import type { JSONAPIRelationshipObject } from './relationshipObject';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIRelationshipsObject = Satisfies<
  { [key: string]: JSONAPIRelationshipObject | JSONAPIRelationshipObject[] },
  JSONObject
>;
