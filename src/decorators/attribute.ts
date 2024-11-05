import { buildSymbol } from '../utils/buildSymbol';

export const attributesSymbol = buildSymbol('attributes');

export const Attribute =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext,
  ): void => {
    if (typeof name !== 'string') {
      throw new Error(
        `@Attribute can only be applied to properties with string keys. ${name.toString()} is of type ${typeof name}.`,
      );
    }

    metadata[attributesSymbol] ??= [];

    (metadata[attributesSymbol] as string[]).push(name);
  };
