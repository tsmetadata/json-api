import { buildSymbol } from './utils/buildSymbol';
import { isValidFieldKey } from './utils/isValidFieldKey';

import type { JSONAPILinksObject } from '../types';

export const linksSymbol = buildSymbol('links');

export const Link =
  () =>
  (
    _target: undefined,
    {
      name,
      metadata,
    }: ClassFieldDecoratorContext<
      unknown,
      JSONAPILinksObject[keyof JSONAPILinksObject]
    >,
  ): void => {
    if (!isValidFieldKey('Link', name)) {
      return;
    }

    metadata[linksSymbol] ??= [];

    (metadata[linksSymbol] as string[]).push(name);
  };
