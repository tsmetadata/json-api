import type { JSONAPIErrorObject } from "./errorObject";
import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONObject } from "./json/object";
import type { JSONAPIResourceObject } from "./resourceObject"
import type { JSONAPILinkObject } from "./linkObject";
import type { JSONAPIPaginationLinks } from "./paginationLinks";
import type { JSONAPIResourceIdentifierObject } from "./resourceIdentifierObject";
import type { Satisfies } from "./helpers/satisfies";
import type { JSONAPIObject } from "./jsonApiObject";

export type JSONAPITopLevelObject = Satisfies<({
  data: JSONAPIResourceObject | JSONAPIResourceObject[] | JSONAPIResourceIdentifierObject | JSONAPIResourceIdentifierObject[] | null;
  included?: JSONAPIResourceObject[];
} | {
  errors: JSONAPIErrorObject[];
}) & {
  jsonapi?: JSONAPIObject,
  meta?: JSONAPIMetaObject;
  links?: JSONAPILinksObject & {
    self?: JSONAPILinkObject;
    related?: JSONAPILinkObject;
    describedby?: JSONAPILinkObject;
  } & JSONAPIPaginationLinks;
}, JSONObject>;