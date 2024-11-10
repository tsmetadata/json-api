import type { Satisfies } from './utils/satisfies';
import type { JSONObject } from './json/object';

export type JSONAPIResourceIdentifierObject = Satisfies<
  {
    type: string;
  } & ({ id: string } | { lid: string }),
  JSONObject
>;
