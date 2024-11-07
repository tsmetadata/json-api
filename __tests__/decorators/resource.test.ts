import { Chance } from 'chance';
import { Resource, resourceSymbol } from '../../src/decorators';

describe('`Resource`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should set the type under the resource symbol in the metadata', () => {
    const type = chance.string();
    const metadata = {};

    Resource(type)(new (class Class {})(), {
      metadata,
    } as ClassDecoratorContext);

    expect(metadata).toEqual({
      [resourceSymbol]: type,
    });
  });
});
