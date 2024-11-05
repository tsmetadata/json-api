import { buildSymbol } from '../utils/buildSymbol';

export const resourceSymbol = buildSymbol('resource');

export const Resource =
  (type: string) =>
  (_target: object, { metadata }: ClassDecoratorContext): void => {
    metadata[resourceSymbol] ??= type;
  };
