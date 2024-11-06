import { buildSymbol } from '../utils/buildSymbol';
import { isValidKey } from '../utils/isValidKey';

import type { ValidDataTypes } from '../types/validDataTypes';

export const metaSymbol = buildSymbol('meta');

export const Meta =
  () =>
  (
    _target: undefined,
    { name, metadata }: ClassFieldDecoratorContext<unknown, ValidDataTypes>,
  ): void => {
    if (!isValidKey('Meta', name)) {
      return;
    }

    metadata[metaSymbol] ??= [];

    (metadata[metaSymbol] as string[]).push(name);
  };
