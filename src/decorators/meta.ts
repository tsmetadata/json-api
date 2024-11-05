import { buildSymbol } from '../utils/buildSymbol';

import type { ValidDataTypes } from '../types/validDataTypes';

export const metasSymbol = buildSymbol('meta');

export const Meta =
  () =>
  (
    _target: undefined,
    {
      name,
      metadata,
    }: ClassFieldDecoratorContext<unknown, string | ValidDataTypes>,
  ): void => {
    if (typeof name !== 'string') {
      throw new Error(
        `@Meta can only be applied to properties with string keys. ${name.toString()} is of type ${typeof name}.`,
      );
    }

    metadata[metasSymbol] ??= [];

    (metadata[metasSymbol] as string[]).push(name);
  };
