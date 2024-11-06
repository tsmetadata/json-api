import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

import type { LinkObject } from '../types/linkObject';

export const linksSymbol = buildSymbol('links');

export const Link =
  () =>
  (
    _target: undefined,
    {
      name,
      metadata,
    }: ClassFieldDecoratorContext<unknown, string | LinkObject>,
  ): void => {
    if(!isValidKey('Link', name)) {
      return;
    }

    metadata[linksSymbol] ??= [];

    (metadata[linksSymbol] as string[]).push(name);
  };
