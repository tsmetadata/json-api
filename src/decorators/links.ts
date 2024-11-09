import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

import type { JSONAPILinksObject } from '../types';

export const linksSymbol = buildSymbol('links');

export const Link =
  () =>
  (
    _target: undefined,
    {
      name,
      metadata,
    }: ClassFieldDecoratorContext<unknown, JSONAPILinksObject[keyof JSONAPILinksObject]>,
  ): void => {
    if (!isValidKey('Link', name)) {
      return;
    }

    metadata[linksSymbol] ??= [];

    (metadata[linksSymbol] as string[]).push(name);
  };
