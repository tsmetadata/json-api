import type { Satisfies } from './utils/satisfies';
import type { JSONObject } from './json/object';

export type JSONAPILinksObject = Satisfies<
  { [key: string]: string | JSONAPILinksObject | null },
  JSONObject
>;
