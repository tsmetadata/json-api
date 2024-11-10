import type { Satisfies } from './helpers/satisfies';
import type { JSONObject } from './json/object';
import type { JSONAPIRelationshipObject } from './relationshipObject';

export type JSONAPIRelationshipsObject = Satisfies<
  { [key: string]: JSONAPIRelationshipObject },
  JSONObject
>;
