import type { JSONAPILinkObject } from "./linkObject";
import type { JSONAPILinksObject } from "./linksObject";
import type { JSONAPIMetaObject } from "./metaObject";
import type { JSONAPIObject } from "./object";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPIErrorObject = Satisfies<{
  id: string;
  links: JSONAPILinksObject & {
    about?: JSONAPILinkObject;
    type?: JSONAPILinkObject;
  };
  status: string;
  code: string;
  title: string;
  detail: string;
  source: {
    pointer: JSONAPIObject;
    parameter: string;
    header: string;
  }
  meta: JSONAPIMetaObject;
}, JSONAPIObject>;