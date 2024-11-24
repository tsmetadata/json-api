import type { JSONObject, JSONPrimitives } from './json';
import type { JSONAPILinkObject } from './linkObject';
import type { Satisfies } from './utils/satisfies';

export type JSONAPILink = Satisfies<
  JSONAPILinkObject | string | null,
  JSONObject | JSONPrimitives
>;
