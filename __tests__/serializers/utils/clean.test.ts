import { Chance } from 'chance';
import { clean } from '../../../src/serializers/utils/clean';

describe('`clean`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should return an empty object when given an empty object', () => {
    const result = clean({});

    expect(result).toEqual({});
  });

  it('should removed undefined values from the given object', () => {
    const object = {
      a: chance.string(),
      b: undefined,
    };

    const result = clean(object);

    expect(result).toEqual({
      a: object.a,
    });
  });

  it('should remove undefined values, recursively, from the given object', () => {
    const object = {
      a: {
        b: undefined,
      },
      c: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      c: object.c,
    });
  });

  it('should remove undefined values, recursively, from the given object, while preserving valid values', () => {
    const object = {
      a: {
        b: undefined,
        c: chance.string(),
      },
      d: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      a: {
        c: object.a.c,
      },
      d: object.d,
    });
  });

  it('should remove empty objects from the given object', () => {
    const object = {
      a: {},
      b: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      b: object.b,
    });
  });

  it('should remove empty objects, recursively, from the given object', () => {
    const object = {
      a: {
        b: {},
      },
      c: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      c: object.c,
    });
  });

  it('should remove empty objects, recursively, from the given object, while preserving valid values', () => {
    const object = {
      a: {
        b: {},
        c: chance.string(),
      },
      d: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      a: {
        c: object.a.c,
      },
      d: object.d,
    });
  });

  it('should remove empty arrays from the given object', () => {
    const object = {
      a: [],
      b: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      b: object.b,
    });
  });

  it('should remove empty arrays, recursively, from the given object', () => {
    const object = {
      a: {
        b: [],
      },
      c: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      c: object.c,
    });
  });

  it('should remove empty arrays, recursively, from the given object, while preserving valid values', () => {
    const object = {
      a: {
        b: [],
        c: chance.string(),
      },
      d: chance.string(),
    };

    const result = clean(object);

    expect(result).toEqual({
      a: {
        c: object.a.c,
      },
      d: object.d,
    });
  });
});
