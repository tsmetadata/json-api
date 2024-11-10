import type { JSONObject } from "./json/object";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPIResourceIdentifierObject = Satisfies<{
  type: string;
} & (
  { id: string }
  | { lid: string }
), JSONObject>;