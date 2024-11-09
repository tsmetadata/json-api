import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONAPIObject } from "./object";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPIResourceIdentifierObject = Satisfies<{
  data: {
    type: string;
    id: string;
  };
  links?: JSONAPILinksObject;
  meta?: JSONAPIMetaObject;
}, JSONAPIObject>;