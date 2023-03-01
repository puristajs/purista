/**
 * Converts a string into kebab-case
 * @param str string
 * @returns string converted to kebab-case
 * @link https://github.com/30-seconds/30-seconds-of-code
 */
export const convertToKebabCase = (str: string): string =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('-') || str
