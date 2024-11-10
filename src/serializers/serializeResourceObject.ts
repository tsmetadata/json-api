import { attributesSymbol, idSymbol, linksSymbol, metaSymbol, relationshipsSymbol, resourceSymbol } from "../decorators";
import { collect } from "./utils/collect";
import { getMetadataBySymbol } from "./utils/getMetadataBySymbol";
import { serializeResourceRelationshipObject } from "./serializeResourceRelationshipObject";

import type { JSONAPILinksObject, JSONAPIMetaObject, JSONAPIRelationshipObject, JSONAPIResourceObject, JSONObject } from "../types";

export const serializeResourceObject = <I extends object>(classInstance: I): JSONAPIResourceObject => {
  const relationshipTuples = getMetadataBySymbol<[keyof I, string][]>(classInstance, relationshipsSymbol);

  const relationships = relationshipTuples.reduce((acc, [key]) => {
    const related = classInstance[key] as object;
    
    acc[key] = Array.isArray(related) ? related.map(serializeResourceRelationshipObject) : serializeResourceRelationshipObject(related);

    return acc;
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