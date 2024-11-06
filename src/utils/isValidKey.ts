import {
  firstOnlyCharacters,
  middleOnlyCharacters,
  reservedCharacters,
} from '../constants/characterSets';

export const isValidKey = (
  decorator: string,
  key: string | symbol | number,
): key is string => {
  const baseErrorMessage = `@${decorator} can only be applied to specific keys.`;

  if (typeof key !== 'string') {
    throw new Error(
      `${baseErrorMessage} Expected key ${key.toString()} to be of type string, but received ${typeof key}.`,
    );
  }

  if (key.length === 0) {
    throw new Error(`${baseErrorMessage} Expected key to be non-empty.`);
  }

  const charactersInKey = key.split('');

  const reservedCharacterViolations = charactersInKey.filter((character) =>
    reservedCharacters.has(character),
  );
  if (reservedCharacterViolations.length > 0) {
    throw new Error(
      `${baseErrorMessage} Expected key ${key} to not contain any reserved characters, but found ${reservedCharacterViolations.join(', ')}.`,
    );
  }

  const firstCharacterViolations = charactersInKey.filter(
    (character, index) => firstOnlyCharacters.has(character) && index !== 0,
  );
  if (firstCharacterViolations.length > 0) {
    throw new Error(
      `${baseErrorMessage} Expected key ${key} to not contain the characters ${firstCharacterViolations.join(', ')}, except as the first character.`,
    );
  }

  const firstOrLastCharacterViolations = charactersInKey.filter(
    (character, index) =>
      middleOnlyCharacters.has(character) &&
      (index === 0 || index === charactersInKey.length - 1),
  );
  if (firstOrLastCharacterViolations.length > 0) {
    throw new Error(
      `${baseErrorMessage} Expected key ${key} to not contain the characters ${firstOrLastCharacterViolations.join(', ')} as the first or last character.`,
    );
  }

  return true;
};
