import type { Satisfies } from './utils/satisfies';
import type { JSONObject } from './json/object';
import type { JSONAPILinksObject } from './linksObject';
import type { JSONAPIMetaObject } from './metaObject';
import type { JSONAPIResourceIdentifierObject } from './resourceIdentifierObject';

export type JSONAPIRelationshipObject = Satisfies<
  {
    data: JSONAPIResourceIdentifierObject;
    links?: JSONAPILinksObject;
    meta?: JSONAPIMetaObject;
  },
  JSONObject
>;
