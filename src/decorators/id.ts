import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

export const idSymbol = buildSymbol('id');

export const Id =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext,
  ): void => {
    if (!isValidKey('Id', name)) {
      return;
    }

    metadata[idSymbol] ??= name;
  };
