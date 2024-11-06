import type { NonArray } from '../types/nonArray';

import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

export const relationshipsSymbol = buildSymbol('relationships');

export const Relationship =
  <T>(key: keyof NonArray<T>) =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, T>,
  ): void => {
    if(!isValidKey('Relationship', key)) {
      return;
    }

    if(!isValidKey('Relationship', name)) {
      return;
    }

    metadata[relationshipsSymbol] ??= [];

    (metadata[relationshipsSymbol] as [string, string][]).push([name, key]);
  };
