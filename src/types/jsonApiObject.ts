import type { JSONObject } from './json/object';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIObject = Satisfies<
  {
    verison?: string;
    ext?: string[];
    profile?: string[];
  },
  JSONObject
>;
