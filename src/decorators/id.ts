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

    if (metadata[idSymbol] !== undefined) {
      throw new Error(
        `Id() can only be applied once per class. Unable to denote ${name} as an id because ${metadata[idSymbol]} is already an id.`,
      );
    }

    metadata[idSymbol] = name;
  };
