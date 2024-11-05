import type { ValidObject } from './validObject';
import type { ValidPrimitives } from './validPrimitives';

export type ValidArray = ValidObject[] | ValidPrimitives[];
