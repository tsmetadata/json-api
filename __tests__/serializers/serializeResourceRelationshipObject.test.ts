import { Chance } from "chance";
import { collect } from "../../src/serializers/utils/collect";
import { getMetadataBySymbol } from "../../src/serializers/utils/getMetadataBySymbol";
import { idSymbol } from '../../src/decorators/id';
import { resourceSymbol } from '../../src/decorators/resource';
import { serializeResourceRelationshipObject } from "../../src/serializers/serializeResourceRelationshipObject";
import { linksSymbol } from "../../src/decorators/links";
import { metaSymbol } from "../../src/decorators/meta";

jest.mock('../../src/serializers/utils/getMetadataBySymbol');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);

jest.mock('../../src/serializers/utils/collect');
const collectMocked = jest.mocked(collect);

describe('`serializeResourceRelationshipObject`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  })

  describe('`data`', () => {
  describe('`type`', () => {
    it('should get the type from the class instance and return it', () => {
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
        (_object: object, symbol: symbol) => {
          if(symbol === idSymbol) {
            return 'id';
          }
          
          return undefined;
        }
      );

      const result = serializeResourceRelationshipObject({});

      expect(result.data).toHaveProperty('type', type);
    });

    it('should throw an error if no type is found on the class instance', () => {
      getMetadataBySymbolMocked.mockImplementation(
        (_: object, symbol: symbol) => {
          if (symbol === resourceSymbol) {
            return undefined;
          }

          return undefined;
        },
      );
      
      collectMocked.mockImplementation(
        (_object: object, symbol: symbol) => {
          if(symbol === idSymbol) {
            return 'id';
          }
          
          return undefined;
        }
      );

      expect(() => serializeResourceRelationshipObject({})).toThrow(
        'Failed to serialize resource relationship object because the provided class instance is not a resource.',
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

      collectMocked.mockImplementation(
        (_object: object, symbol: symbol) => {
          if(symbol === idSymbol) {
            return id;
          }
          
          return undefined;
        }
      );

      const result = serializeResourceRelationshipObject({});

      expect(result.data).toHaveProperty('id', id);
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
        (_object: object, symbol: symbol) => undefined
      );

      expect(() => serializeResourceRelationshipObject({})).toThrow(
        'Failed to serialize resource relationship object because the provided class instance does not have an id field.',
      );
    });
  });
});

  describe('`links`', () => {
    it('should get the links from the class instance and return them', () => {
      const links = {
        self: chance.url()
      }

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

      const result = serializeResourceRelationshipObject({});

      expect(result.links).toEqual(links);
    });
  })

  describe('`meta`', () => {
    it('should get the meta from the class instance and return them', () => {
      const meta = {
        self: chance.url()
      }

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

      const result = serializeResourceRelationshipObject({});

      expect(result.meta).toEqual(meta);
    });
  });
});
