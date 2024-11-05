import { buildSymbol } from '../utils/buildSymbol';

export const idSymbol = buildSymbol('id');

export const Id =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext,
  ): void => {
    if (typeof name !== 'string') {
      throw new Error(
        `@Id can only be applied to properties with string keys. ${name.toString()} is of type ${typeof name}.`,
      );
    }

    metadata[idSymbol] ??= name;
  };
