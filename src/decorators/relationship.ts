import type { NonArray } from '../types/utils/nonArray';

import { buildSymbol } from '../utils/buildSymbol';
import { isValidFieldKey } from '../utils/isValidFieldKey';

export const relationshipsSymbol = buildSymbol('relationships');

export const Relationship =
  <T>(foreignKey: keyof NonArray<T>) =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, T>,
  ): void => {
    if (!isValidFieldKey('Relationship', foreignKey)) {
      return;
    }

    if (!isValidFieldKey('Relationship', name)) {
      return;
    }

    metadata[relationshipsSymbol] ??= [];

    (metadata[relationshipsSymbol] as [string, string][]).push([
      name,
      foreignKey,
    ]);
  };
