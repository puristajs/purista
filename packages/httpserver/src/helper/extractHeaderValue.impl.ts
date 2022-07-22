export const extractHeaderValue = (
  input: Record<string, string | string[] | undefined> | undefined,
  key: string,
  def: string,
): string => {
  if (!input) {
    return def
  }

  const value = input[key]
  if (Array.isArray(value) && value.length) {
    return value[0]
  }

  if (typeof value === 'string' && value.length) {
    return value
  }
  return def
}
