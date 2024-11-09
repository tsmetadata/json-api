import type { JSONAPIErrorObject } from "./errorObject";
import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONAPIObject } from "./object";
import type { JSONAPIResourceObject } from "./resourceObject"
import type { JSONAPILinkObject } from "./linkObject";
import type { JSONAPIPaginationLinks } from "./paginationLinks";
import type { JSONAPIResourceIdentifierObject } from "./resourceIdentifierObject";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPITopLevelObject = Satisfies<({
  data: JSONAPIResourceObject | JSONAPIResourceObject[] | JSONAPIResourceIdentifierObject | JSONAPIResourceIdentifierObject[] | null;
  included?: JSONAPIResourceObject[];
} | {
  errors: JSONAPIErrorObject[];
}) & {
  jsonapi?: {
    verison?: string;
    ext?: string[];
    profile?: string[];
  },
  meta?: JSONAPIMetaObject;
  links?: JSONAPILinksObject & {
    self?: JSONAPILinkObject;
    related?: JSONAPILinkObject;
    describedby?: JSONAPILinkObject;
  } & JSONAPIPaginationLinks;
}, JSONAPIObject>;