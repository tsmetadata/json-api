import type { ValidArray } from './validArray';
import type { ValidObject } from './validObject';
import type { ValidPrimitives } from './validPrimitives';

export type ValidDataTypes = ValidPrimitives | ValidArray | ValidObject;
