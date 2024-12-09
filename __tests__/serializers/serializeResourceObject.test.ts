import { Chance } from 'chance';
import { idSymbol } from '../../src/decorators/id';
import { linksSymbol } from '../../src/decorators/link';
import { metaSymbol } from '../../src/decorators/meta';
import { relationshipsSymbol } from '../../src/decorators/relationship';
import { resourceSymbol } from '../../src/decorators/resource';
import { serializeResourceLinkage } from '../../src/serializers/serializeResourceLinkage';
import { serializeResourceObject } from '../../src/serializers/serializeResourceObject';
import { collect } from '../../src/serializers/utils/collect';
import { getMetadataBySymbol } from '../../src/serializers/utils/getMetadataBySymbol';

import type { JSONAPIResourceIdentifierObject } from '../../src';
import type { JSONAPIResourceLinkage } from '../../src/types/resourceLinkage';

jest.mock('../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

jest.mock('../../src/serializers/utils/collect');
const collectMocked = jest.mocked(collect);

jest.mock('../../src/serializers/serializeResourceLinkage');
const serializeResourceLinkageMocked = jest.mocked(serializeResourceLinkage);

jest.mock('../../src/serializers/utils/assertMetadataIsPresent');

describe('`serializeResourceObject`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  describe('`relationships`', () => {
    describe('when the related class instance is an array', () => {
      it('should throw an error if an element in the array is not an object', () => {
        const key = chance.string();

        getMetadataBySymbolMocked.mockImplementation(
          (_: object, symbol: symbol) => {
            if (symbol === relationshipsSymbol) {
              return [[key, '']];
            }

            return undefined;
          },
        );

        const classInstance = {
          [key]: ['not-an-object'],
        };

        expect(() => serializeResourceObject(classInstance)).toThrow(
          'Failed to serialize resource object because the provided class instance is not a resource.',
        );
      });

      it('should serialize defined relationship objects and return them', () => {
        const key = chance.string();

        getMetadataBySymbolMocked.mockImplementation(
          (_: object, symbol: symbol) => {
            if (symbol === resourceSymbol) {
              return 'type';
            }

            if (symbol === relationshipsSymbol) {
              return [[key, '']];
            }

            return undefined;
          },
        );

        collectMocked.mockImplementation((_: object, symbol: symbol) => {
          if (symbol === idSymbol) {
            return 'id';
          }

          return undefined;
        });

        const relatedClassInstance = {
          a: chance.string(),
        };

        const secondRelatedClassInstance = {
          c: chance.string(),
        };

        const classInstance = {
          [key]: [relatedClassInstance, secondRelatedClassInstance],
        };

        const b = chance.string();

        serializeResourceLinkageMocked.mockImplementation((classInstance_s) => {
          return (classInstance_s as object[]).map(
            (classInstance) =>
              ({
                ...classInstance,
                b,
              }) as unknown as JSONAPIResourceIdentifierObject,
          );
        });

        const result = serializeResourceObject(classInstance);

        expect(result.relationships).toEqual({
          [key]: {
            data: [
              {
                ...relatedClassInstance,
                b,
              },
              {
                ...secondRelatedClassInstance,
                b,
              },
            ],
          },
        });
      });
    });

    describe('when the related class instance is not an object', () => {
      it('should throw an error', () => {
        const key = chance.string();

        getMetadataBySymbolMocked.mockImplementation(
          (_: object, symbol: symbol) => {
            if (symbol === relationshipsSymbol) {
              return [[key, '']];
            }

            return undefined;
          },
        );

        const classInstance = {
          [key]: 'not-an-object',
        };

        expect(() => serializeResourceObject(classInstance)).toThrow(
          `Failed to serialize relationship object for ${key} because the value is not an object.`,
        );
      });
    });

    describe('when the related class instance is an object', () => {
      it('should serialize the relationships object and return it', () => {
        const key = chance.string();

        getMetadataBySymbolMocked.mockImplementation(
          (_: object, symbol: symbol) => {
            if (symbol === resourceSymbol) {
              return 'type';
            }

            if (symbol === relationshipsSymbol) {
              return [[key, '']];
            }

            return undefined;
          },
        );

        collectMocked.mockImplementation((_: object, symbol: symbol) => {
          if (symbol === idSymbol) {
            return 'id';
          }

          return undefined;
        });

        const relatedClassInstance = {
          a: chance.string(),
        };

        const classInstance = {
          [key]: relatedClassInstance,
        };

        const b = chance.string();

        serializeResourceLinkageMocked.mockImplementation(
          (classInstance) =>
            ({
              ...classInstance,
              b,
            }) as unknown as Exclude<JSONAPIResourceLinkage, null>,
        );

        const result = serializeResourceObject(classInstance);

        expect(result.relationships).toEqual({
          [key]: {
            data: {
              ...relatedClassInstance,
              b,
            },
          },
        });
      });
    });

    describe('when the related class instance is already a relationship object', () => {
      it('should return without serializing the relationship object', () => {
        const key = chance.string();

        getMetadataBySymbolMocked.mockImplementation(
          (_: object, symbol: symbol) => {
            if (symbol === resourceSymbol) {
              return 'type';
            }

            if (symbol === relationshipsSymbol) {
              return [[key, '']];
            }

            return undefined;
          },
        );

        collectMocked.mockImplementation((_: object, symbol: symbol) => {
          if (symbol === idSymbol) {
            return 'id';
          }

          return undefined;
        });

        const relatedClassInstance = {
          id: 'some id',
          type: 'some type',
        };

        const classInstance = {
          [key]: {
            data: relatedClassInstance,
          },
        };

        const result = serializeResourceObject(classInstance);

        expect(result.relationships).toBeUndefined();
      });
    });

    it('should return without the `relationships` field if no relationships are found', () => {
      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return 'id';
        }

        return undefined;
      });

      const result = serializeResourceObject({});

      expect(result.relationships).toBeUndefined();
    });

    it('should not serialize undefined or null class instances', () => {
      const key = chance.string();

      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          if (symbol === relationshipsSymbol) {
            return [[key, '']];
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return 'id';
        }

        return undefined;
      });

      const result = serializeResourceObject({
        [key]: undefined,
        [key]: null,
      });

      expect(serializeResourceLinkageMocked).not.toHaveBeenCalled();

      expect(result.relationships).toBeUndefined();
    });
  });

  describe('`type`', () => {
    it('should get the resource type and return it', () => {
      const type = chance.string();

      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return type;
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation(
        (_object: object, _symbol: symbol) => 'some-collected-value',
      );

      const result = serializeResourceObject({});

      expect(result.type).toBe(type);
    });

    it('should throw an error if no type is found on the class instance', () => {
      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === idSymbol) {
            return 'id';
          }

          return undefined;
        },
      );

      expect(() => serializeResourceObject({})).toThrow(
        'Failed to serialize resource object because the provided class instance is not a resource.',
      );
    });
  });

  describe('`id`', () => {
    it('should get the id from the class instance and return it', () => {
      const id = chance.string();

      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return id;
        }

        return undefined;
      });

      const result = serializeResourceObject({});

      expect(result.id).toBe(id);
    });

    it('should throw an error if no id is found on the class instance', () => {
      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation(
        (_object: object, _symbol: symbol) => undefined,
      );

      expect(() => serializeResourceObject({})).toThrow(
        'Failed to serialize resource object because the provided class instance does not have an id.',
      );
    });
  });

  describe('`links`', () => {
    it('should collect the links from the class instance and return it', () => {
      const links = {
        self: chance.url(),
        related: chance.url(),
      };

      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return 'id';
        }

        if (symbol === linksSymbol) {
          return links;
        }

        return undefined;
      });

      const result = serializeResourceObject({});

      expect(result.links).toEqual(links);
    });

    it('should return without the `links` field if no links are found', () => {
      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return 'id';
        }

        return undefined;
      });

      const result = serializeResourceObject({});

      expect(result.links).toBeUndefined();
    });
  });

  describe('`meta`', () => {
    it('should collect the meta from the class instance and return it', () => {
      const meta = {
        some: chance.string(),
        random: chance.string(),
      };

      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return 'id';
        }

        if (symbol === metaSymbol) {
          return meta;
        }

        return undefined;
      });

      const result = serializeResourceObject({});

      expect(result.meta).toEqual(meta);
    });

    it('should return without the `meta` field if no meta is found', () => {
      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return 'type';
          }

          return undefined;
        },
      );

      collectMocked.mockImplementation((_: object, symbol: symbol) => {
        if (symbol === idSymbol) {
          return 'id';
        }

        return undefined;
      });

      const result = serializeResourceObject({});

      expect(result.meta).toBeUndefined();
    });
  });
});
