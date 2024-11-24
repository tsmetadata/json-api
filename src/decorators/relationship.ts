import { buildSymbol } from './utils/buildSymbol';
import { isValidFieldKey } from './utils/isValidFieldKey';

import type { JSONAPIResourceLinkage } from '../types/resourceLinkage';
import type { NonArray } from '../types/utils/nonArray';

export const relationshipsSymbol = buildSymbol('relationships');

type ForeignKey<T> = Extract<T, JSONAPIResourceLinkage> extends never
  ? never
  : keyof NonArray<Exclude<T, JSONAPIResourceLinkage>>;

export const Relationship =
  <T>(foreignKey: ForeignKey<T>) =>
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
