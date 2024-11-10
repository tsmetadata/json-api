import { buildSymbol } from './utils/buildSymbol';
import { isValidFieldKey } from './utils/isValidFieldKey';

export const attributesSymbol = buildSymbol('attributes');

export const Attribute =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext,
  ): void => {
    if (!isValidFieldKey('Attribute', name)) {
      return;
    }

    metadata[attributesSymbol] ??= [];

    (metadata[attributesSymbol] as string[]).push(name);
  };
