/**
 * Checks if a given topic is matching against a subscription pattern
 *
 * @param input the real full topic
 * @param pattern the topic subscription pattern
 * @returns
 */
export const isMatchingTopic = (input: string, pattern: string) => {
  const inputArray = input.split('/')
  const inLength = inputArray.length
  const patternArray = pattern.split('/')
  const paLength = patternArray.length

  if (paLength > inLength) {
    return false
  }

  if (inLength > paLength && patternArray[paLength - 1] !== '#') {
    return false
  }

  for (const index in patternArray) {
    const part = patternArray[index]
    const checkPart = inputArray[index]

    if (part === '#') {
      return true
    }
    if (part === '+') {
      continue
    }
    if (checkPart !== part) {
      return false
    }
  }

  return true
}
