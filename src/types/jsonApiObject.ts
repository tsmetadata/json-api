import type { Satisfies } from "./helpers/satisfies";
import type { JSONObject } from "./json/object";

export type JSONAPIObject = Satisfies<{
  verison?: string;
  ext?: string[];
  profile?: string[];
}, JSONObject>;