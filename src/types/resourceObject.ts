import type { JSONAPIAttributesObject } from './attributesObject';
import type { JSONObject } from './json/object';
import type { JSONAPILinkObject } from './linkObject';
import type { JSONAPILinksObject } from './linksObject';
import type { JSONAPIMetaObject } from './metaObject';
import type { JSONAPIRelationshipsObject } from './relationshipsObject';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIResourceObject = Satisfies<
  {
    type: string;
    id: string;
    attributes?: JSONAPIAttributesObject;
    relationships?: JSONAPIRelationshipsObject;
    links?: JSONAPILinksObject & {
      self?: JSONAPILinkObject;
    };
    meta?: JSONAPIMetaObject;
  },
  JSONObject
>;
