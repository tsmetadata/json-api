import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

import type { JSONDataTypes } from '../types';

export const metaSymbol = buildSymbol('meta');

export const Meta =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, JSONDataTypes>,
  ): void => {
    if (!isValidKey('Meta', name)) {
      return;
    }

    metadata[metaSymbol] ??= [];

    (metadata[metaSymbol] as string[]).push(name);
  };
