/**
 * Converts a string into snake_case
 * @param str string
 * @returns string converted to snake_case
 * @link https://github.com/30-seconds/30-seconds-of-code
 *
 * @group Helper
 */
export const convertToSnakeCase = (str: string): string =>
	str
		.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
		?.map(x => x.toLowerCase())
		.join('_') ?? str
