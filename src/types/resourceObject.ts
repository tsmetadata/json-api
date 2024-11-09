import type { JSONAPIAttributesObject } from "./attributesObject";
import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONAPIObject } from "./object";
import type { JSONAPIRelationshipsObject } from "./relationshipsObject";
import type { JSONAPILinkObject } from "./linkObject";
import type { Satisfies } from "./helpers/satisfies";

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
  }
, JSONAPIObject>;