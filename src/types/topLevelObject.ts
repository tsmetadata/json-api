import type { JSONAPIErrorObject } from './errorObject';
import type { Satisfies } from './helpers/satisfies';
import type { JSONObject } from './json/object';
import type { JSONAPIObject } from './jsonApiObject';
import type { JSONAPILinkObject } from './linkObject';
import type { JSONAPILinksObject } from './linksObject';
import type { JSONAPIMetaObject } from './metaObject';
import type { JSONAPIPaginationLinks } from './paginationLinks';
import type { JSONAPIResourceIdentifierObject } from './resourceIdentifierObject';
import type { JSONAPIResourceObject } from './resourceObject';

export type JSONAPITopLevelObject = Satisfies<
  (
    | {
        data:
          | JSONAPIResourceObject
          | JSONAPIResourceObject[]
          | JSONAPIResourceIdentifierObject
          | JSONAPIResourceIdentifierObject[]
          | null;
        included?: JSONAPIResourceObject[];
      }
    | {
        errors: JSONAPIErrorObject[];
      }
  ) & {
    jsonapi?: JSONAPIObject;
    meta?: JSONAPIMetaObject;
    links?: JSONAPILinksObject & {
      self?: JSONAPILinkObject;
      related?: JSONAPILinkObject;
      describedby?: JSONAPILinkObject;
    } & JSONAPIPaginationLinks;
  },
  JSONObject
>;
