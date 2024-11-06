import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

export const attributesSymbol = buildSymbol('attributes');

export const Attribute =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext,
  ): void => {
    if(!isValidKey('Attribute', name)) {
      return;
    }

    metadata[attributesSymbol] ??= [];

    (metadata[attributesSymbol] as string[]).push(name);
  };
