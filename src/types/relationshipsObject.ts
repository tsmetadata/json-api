import type { Satisfies } from './utils/satisfies';
import type { JSONObject } from './json/object';
import type { JSONAPIRelationshipObject } from './relationshipObject';

export type JSONAPIRelationshipsObject = Satisfies<
  { [key: string]: JSONAPIRelationshipObject | JSONAPIRelationshipObject[] },
  JSONObject
>;
