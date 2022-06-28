import { StatusCode } from '../types'

export const getErrorMessageForCode = (code: StatusCode): string => {
  const entry = StatusCode[code]

  if (!entry) {
    return 'Unknown Error'
  }

  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }

  const transform = (input: string) =>
    input.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? ' ' : '') + capitalizeFirstLetter($))

  return transform(StatusCode[code])
}
