import { idSymbol, linksSymbol, metaSymbol, resourceSymbol } from "../decorators";
import { collect } from "./utils/collect";
import { getMetadataBySymbol } from "./utils/getMetadataBySymbol";

import type { JSONAPILinksObject, JSONAPIMetaObject, JSONAPIRelationshipObject } from "../types";

export const serializeResourceRelationshipObject = <I extends object>(classInstance: I): JSONAPIRelationshipObject => ({
  data: {
    type: getMetadataBySymbol<string>(classInstance, resourceSymbol),
    id: collect<string>(classInstance, idSymbol),
  },
  links: collect<JSONAPILinksObject>(classInstance, linksSymbol),
  meta: collect<JSONAPIMetaObject>(classInstance, metaSymbol),
});