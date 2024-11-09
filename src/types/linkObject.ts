import type { JSONAPIMetaObject } from './metaObject';
import type { JSONAPIObject } from './object';
import type { Satisfies } from './helpers/satisfies';

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
  JSONAPIObject
>;
