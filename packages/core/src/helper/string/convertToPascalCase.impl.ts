/**
 * Converts a string into PascalCase
 * @param str string
 * @returns string converted to PascalCase
 * @link https://github.com/30-seconds/30-seconds-of-code
 *
 * @group Helper
 */
export const convertToPascalCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('') ?? str
