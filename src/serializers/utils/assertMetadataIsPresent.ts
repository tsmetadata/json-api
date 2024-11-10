export const assertMetadataIsPresent = (candidate: unknown | unknown[]): true => {
  if (Symbol.metadata === undefined) {
    throw new Error(
      'Failed to assert the presence of metadata because the metadata symbol is undefined. You may need to import the `@tsmetadata/polyfill` package.',
    );
  }

  const objects = Array.isArray(candidate) ? candidate : [candidate];

  for (const object of objects) {
    if(typeof object !== 'object') {
      throw new Error(
        'Failed to assert the presence of metadata because at least one candidate is not an object, meaning no constructor is present.',
      );
    }

    const metadata = object.constructor[Symbol.metadata];

    if (metadata === undefined || metadata === null) {
      throw new Error(
        'No metadata was found on an object constructor.'
      );
    }
  }

  return true;
};