import type { JSONAPILink } from './link';
import type { JSONAPILinksObject } from './linksObject';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIPaginationLinks = Satisfies<
  {
    first?: JSONAPILink;
    last?: JSONAPILink;
    prev?: JSONAPILink;
    next?: JSONAPILink;
  },
  JSONAPILinksObject
>;
