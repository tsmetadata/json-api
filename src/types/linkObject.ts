import type { MetaObject } from './metaObject';
import type { Satisfies } from './satisfies';
import type { ValidObject } from './validObject';

export type LinkObject = Satisfies<
  {
    href: string;
    rel?: string;
    describedby?: string;
    title?: string;
    type?: string;
    hreflang?: string;
    meta?: MetaObject;
  },
  ValidObject
>;
