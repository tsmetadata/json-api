import type { JSONObject } from './json/object';
import type { Satisfies } from './utils/satisfies';

export type JSONAPIResourceIdentifierObject = Satisfies<
  {
    type: string;
  } & { id: string },
  /*
   * Due to poor specification, the following is not yet supported:
   * | { lid: string })
   **/
  JSONObject
>;
