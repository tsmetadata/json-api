import type { JSONAPIObject } from "./object";
import type { JSONAPIResourceIdentifierObject } from "./resourceIdentifierObject";
import type { Satisfies } from "./helpers/satisfies";

export type JSONAPIRelationshipsObject = Satisfies<{ [key: string]: JSONAPIResourceIdentifierObject }, JSONAPIObject>;