import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

import type { JSONAPIDataTypes } from '../types/json/dataTypes';

export const metaSymbol = buildSymbol('meta');

export const Meta =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, JSONAPIDataTypes>,
  ): void => {
    if (!isValidKey('Meta', name)) {
      return;
    }

    metadata[metaSymbol] ??= [];

    (metadata[metaSymbol] as string[]).push(name);
  };
