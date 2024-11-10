import { attributesSymbol, idSymbol, linksSymbol, metaSymbol, relationshipsSymbol, resourceSymbol } from "../decorators";
import { collect } from "./utils/collect";
import { getMetadataBySymbol } from "./utils/getMetadataBySymbol";
import { serializeResourceRelationshipObject } from "./serializeResourceRelationshipObject";

import type { JSONAPILinksObject, JSONAPIMetaObject, JSONAPIRelationshipObject, JSONAPIResourceObject, JSONObject } from "../types";

export const isObject = (value: unknown): value is object => value !== null && typeof value === 'object';

export const serializeResourceObject = <I extends object>(classInstance: I): JSONAPIResourceObject => {
  const relationshipTuples = getMetadataBySymbol<[keyof I, string][]>(classInstance, relationshipsSymbol);

  const relationships = relationshipTuples.reduce((acc, [key]) => {
    const relatedClassInstance = classInstance[key];
    
    if(Array.isArray(relatedClassInstance)) {
      if(relatedClassInstance.every(isObject)) {
        acc[key] = relatedClassInstance.map(serializeResourceRelationshipObject);

        return acc;
      }

      throw new Error(`Failed to serialize resource relationship object for ${key.toString()} becuase not all elements in the array are objects.`);
    }

    if(isObject(relatedClassInstance)) {
      acc[key] = serializeResourceRelationshipObject(relatedClassInstance as object);

      return acc;
    }

    throw new Error(`Failed to serialize resource relationship object for ${key.toString()} because the value is not an object.`);
  }, {} as Record<keyof I, JSONAPIRelationshipObject | JSONAPIRelationshipObject[]>);

  return {
    type: getMetadataBySymbol<string>(classInstance, resourceSymbol),
    id: collect<string>(classInstance, idSymbol),
    attributes: collect<JSONObject>(classInstance, attributesSymbol),
    relationships,
    links: collect<JSONAPILinksObject>(classInstance, linksSymbol),
    meta: collect<JSONAPIMetaObject>(classInstance, metaSymbol),
  };
};