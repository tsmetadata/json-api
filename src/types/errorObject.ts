import type { Satisfies } from './utils/satisfies';
import type { JSONObject } from './json/object';
import type { JSONAPILinkObject } from './linkObject';
import type { JSONAPILinksObject } from './linksObject';
import type { JSONAPIMetaObject } from './metaObject';

export type JSONAPIErrorObject = Satisfies<
  {
    id: string;
    links: JSONAPILinksObject & {
      about?: JSONAPILinkObject;
      type?: JSONAPILinkObject;
    };
    status: string;
    code: string;
    title: string;
    detail: string;
    source: {
      pointer: JSONObject;
      parameter: string;
      header: string;
    };
    meta: JSONAPIMetaObject;
  },
  JSONObject
>;
