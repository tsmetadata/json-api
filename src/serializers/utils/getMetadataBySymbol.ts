import { assertMetadataIsPresent } from './assertMetadataIsPresent';

export const getMetadataBySymbol = <T = unknown, O extends object = object>(
  object: O,
  symbol: symbol,
) => {
  assertMetadataIsPresent(object);

  const metadata = object.constructor[
    Symbol.metadata
  ] as DecoratorMetadataObject;

  return metadata[symbol] as T | undefined;
};
