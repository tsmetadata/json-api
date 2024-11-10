import { getMetadataBySymbol } from "./utils/getMetadataBySymbol";

import { relationshipsSymbol } from "../decorators";
import { isObject, serializeResourceObject } from "./serializeResourceObject";

import type { JSONAPIResourceObject } from "../types";

export const serializeIncludedResourceObject = <I extends object>(classInstance: I, included: (keyof I)[]): JSONAPIResourceObject[] => {
  const relationshipTuples = getMetadataBySymbol<[keyof I, string][]>(classInstance, relationshipsSymbol);

  const relationships = relationshipTuples.reduce((acc, [key]) => {
    const relatedClassInstance = classInstance[key];
    
    if(Array.isArray(relatedClassInstance)) {
      if(relatedClassInstance.every(isObject)) {
        acc.push(...relatedClassInstance.map(serializeResourceObject));

        return acc;
      }

      throw new Error(`Failed to serialize resource relationship object for ${key.toString()} becuase not all elements in the array are objects.`);
    }

    if(isObject(relatedClassInstance)) {
      acc.push(serializeResourceObject(relatedClassInstance));

      return acc;
    }

    throw new Error(`Failed to serialize resource relationship object for ${key.toString()} because the value is not an object.`);
  }, [] as JSONAPIResourceObject[]);

  return relationships;
};