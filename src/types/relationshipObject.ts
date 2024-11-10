import type { JSONAPIResourceIdentifierObject } from "./resourceIdentifierObject";
import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONObject } from "./json/object";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPIRelationshipObject = Satisfies<{
  data: JSONAPIResourceIdentifierObject;
  links?: JSONAPILinksObject;
  meta?: JSONAPIMetaObject;
}, JSONObject>;