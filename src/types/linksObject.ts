import type { JSONObject } from './json/object';
import type { JSONAPILink } from './link';
import type { Satisfies } from './utils/satisfies';

export type JSONAPILinksObject = Satisfies<
  { [key: string]: JSONAPILink },
  JSONObject
>;
