import type { JSONObject } from './json/object';
import type { JSONAPILinksObject } from './linksObject';
import type { JSONAPIMetaObject } from './metaObject';
import type { JSONAPIResourceLinkage } from './resourceLinkage';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIRelationshipObject = Satisfies<
  {
    data: JSONAPIResourceLinkage;
    links?: JSONAPILinksObject;
    meta?: JSONAPIMetaObject;
  },
  JSONObject
>;
