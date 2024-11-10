import type { JSONObject } from "./json/object";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPILinksObject = Satisfies<{ [key: string]: string | JSONAPILinksObject | null }, JSONObject>;