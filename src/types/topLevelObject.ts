import type { JSONAPIErrorObject } from "./errorObject";
import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONAPIObject } from "./object";
import type { JSONAPIResourceIdentifierObject } from "./resourceIdentifierObject"
import type { JSONAPIResourceObject } from "./resourceObject"
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPITopLevelObject = Satisfies<({
  data: JSONAPIResourceObject | JSONAPIResourceObject[] | JSONAPIResourceIdentifierObject | JSONAPIResourceIdentifierObject[] | null;
  included?: JSONAPIResourceObject[];
} | {
  errors: JSONAPIErrorObject[];
}) & {
  meta?: JSONAPIMetaObject;
  links?: JSONAPILinksObject;
}, JSONAPIObject>;