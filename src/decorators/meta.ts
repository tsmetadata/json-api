import { buildSymbol } from './utils/buildSymbol';
import { isValidFieldKey } from './utils/isValidFieldKey';

import type { JSONDataTypes } from '../types';

export const metaSymbol = buildSymbol('meta');

export const Meta =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, JSONDataTypes>,
  ): void => {
    if (!isValidFieldKey('Meta', name)) {
      return;
    }

    metadata[metaSymbol] ??= [];

    (metadata[metaSymbol] as string[]).push(name);
  };
