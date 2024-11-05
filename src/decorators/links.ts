import { buildSymbol } from '../utils/buildSymbol';

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
    if (typeof name !== 'string') {
      throw new Error(
        `@Link can only be applied to properties with string keys. ${name.toString()} is of type ${typeof name}.`,
      );
    }

    metadata[linksSymbol] ??= [];

    (metadata[linksSymbol] as string[]).push(name);
  };
