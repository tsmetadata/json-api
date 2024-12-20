import type { JSONAPIErrorObject } from './errorObject';
import type { JSONObject } from './json/object';
import type { JSONAPIObject } from './jsonApiObject';
import type { JSONAPILink } from './link';
import type { JSONAPILinksObject } from './linksObject';
import type { JSONAPIMetaObject } from './metaObject';
import type { JSONAPIPaginationLinks } from './paginationLinks';
import type { JSONAPIResourceIdentifierObject } from './resourceIdentifierObject';
import type { JSONAPIResourceObject } from './resourceObject';
import type { Satisfies } from './utils/satisfies';

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
    links?: Satisfies<
      JSONAPILinksObject & {
        self?: JSONAPILink;
        related?: JSONAPILink;
        describedby?: JSONAPILink;
      } & JSONAPIPaginationLinks,
      JSONAPILinksObject
    >;
  },
  JSONObject
>;
