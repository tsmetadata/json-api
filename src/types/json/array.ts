import type { JSONObject } from './object';
import type { JSONPrimitives } from './primitives';

export type JSONArray = JSONObject[] | JSONPrimitives[];
