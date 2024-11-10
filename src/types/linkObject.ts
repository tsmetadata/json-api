import type { Satisfies } from './utils/satisfies';
import type { JSONObject } from './json/object';
import type { JSONAPIMetaObject } from './metaObject';

export type JSONAPILinkObject = Satisfies<
  {
    href: string;
    rel?: string;
    describedby?: string;
    title?: string;
    type?: string;
    hreflang?: string;
    meta?: JSONAPIMetaObject;
  },
  JSONObject
>;
