import { attributesSymbol, linksSymbol, metaSymbol, resourceSymbol, idSymbol, relationshipsSymbol } from "../decorators";
import type { MetaObject, ValidObject, Link } from "../types";

export const hasMetadata = (candidate: object | object[]): true => {
  const objects = Array.isArray(candidate) ? candidate : [candidate];

  for(const object of objects) {
    if(Symbol.metadata === undefined) {
      throw new Error('Failed to serialize object because the metadata symbol does not exist. You may need to import the `@tsmetadata/polyfill` package.')
    }

    const metadata = object.constructor[Symbol.metadata];

    if(metadata === undefined) {
      throw new Error('Failed to serialize object because no metadata was found on it\'s constructor.');
    }
  }

  return true;
}

export const collect = <T>(object: object, symbol: symbol) => {
  // TODO: make this clearer
  hasMetadata(object);

  const metadata = object.constructor[Symbol.metadata];

  const key: string = metadata[symbol];

  return object[key] as T;
}

export const collectConstant = <T>(object: object, symbol: symbol) => {
  // TODO: make this clearer
  hasMetadata(object);

  const metadata = object.constructor[Symbol.metadata];

  const constant = metadata[symbol];

  return constant as T;
}

export const collectArray = <T>(object: object, symbol: symbol) => {
  // TODO: make this clearer
  hasMetadata(object);

  const metadata = object.constructor[Symbol.metadata];

  const keys = metadata[symbol] ?? [];

  if(keys.length === 0) {
    return {} as T;
  }

  return keys.reduce((acc, key) => {
    const value = object[key];

    if(value === undefined) {
      return acc;
    }

    acc[key] = value;

    return acc;
  }, {}) as T;
}

type ResourceIdentifierObject = {
  data: {
    type: string;
    id: string;
  };
  links?: { [key: string]: Link };
  meta?: MetaObject;
}

export const collectResourceIdentifier = (object: object) => {
  // TODO: make this clearer
  hasMetadata(object);

  return {
    data: {
      type: collectConstant<string>(object, resourceSymbol),
      id: collect<string>(object, idSymbol),
    },
    links: collectArray<{ [key: string]: Link  }>(object, linksSymbol),
    meta: collectArray<MetaObject>(object, metaSymbol),
  }
}

export const collectRelationships = (object: object) => {
  // TODO: make this clearer
  hasMetadata(object);

  const metadata = object.constructor[Symbol.metadata];

  const keyForeignKeyTuples = metadata[relationshipsSymbol] ?? [];

  if(keyForeignKeyTuples.length === 0) {
    return {};
  }

  return keyForeignKeyTuples.reduce((acc, [key]) => {
    const relatedObject = object[key];

    if(relatedObject === undefined) {
      return acc;
    }

    // TODO: make this clearer
    hasMetadata(relatedObject);

    acc[key] = Array.isArray(relatedObject) ? relatedObject.map(collectResourceIdentifier) : collectResourceIdentifier(relatedObject);

    return acc;
  }, {}) as { [key: string]: ResourceIdentifierObject | ResourceIdentifierObject[]};
}

const serializeResource = (instance: object) => {
  // TODO: make this clearer
  hasMetadata(instance)

  return {
    type: collectConstant<string>(instance, resourceSymbol),
    id: collect<string>(instance, idSymbol),
    attributes: collectArray<ValidObject>(instance, attributesSymbol),
    relationships: collectRelationships(instance),
    links: collectArray<{ [key: string]: Link }>(instance, linksSymbol),
    meta: collectArray<MetaObject>(instance, metaSymbol),
  }
}

const isObject = (candidate: unknown): candidate is object => {
  return candidate !== null && typeof candidate === 'object';
}

export const serializeDocument = <T extends object>(instance: T, included: (keyof T)[] = []) => {
  // TODO: make this clearer
  hasMetadata(instance)

  const resource = serializeResource(instance);

  return {
    data: resource,
    included: included.flatMap((key) => {
      const relatedObject = instance[key];

      if(relatedObject === undefined) {
        return;
      }

      if(!isObject(relatedObject)) {
        throw new Error(`Failed to serialize relationship ${key.toString()} because it is not an object.`);
      }

      if(Array.isArray(relatedObject)) {
        return relatedObject.map(serializeResource);
      }

      return serializeResource(relatedObject);
    })
  }
}