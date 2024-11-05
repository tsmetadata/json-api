import type { NonArray } from '../types/nonArray';

import { buildSymbol } from '../utils/buildSymbol';

export const relationshipsSymbol = buildSymbol('relationships');

export const Relationship =
  <T>(key: keyof NonArray<T>) =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, T>,
  ): void => {
    if (typeof key !== 'string') {
      throw new Error(
        `@Relationship can only be applied to properties with string keys. ${key.toString()} is of type ${typeof key}.`,
      );
    }

    if (typeof name !== 'string') {
      throw new Error(
        `@Relationship can only be applied to properties with string keys. ${name.toString()} is of type ${typeof name}.`,
      );
    }

    metadata[relationshipsSymbol] ??= [];

    (metadata[relationshipsSymbol] as [string, string][]).push([name, key]);
  };
