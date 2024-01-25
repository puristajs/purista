import { StatusCode } from '@purista/core'

export const getErrorName = (code: StatusCode) =>
  StatusCode[code]
    .replace(/[A-Z]/g, (letter) => ` ${letter}`)
    .replace(/^./, (str) => {
      return str.toUpperCase()
    })
    .trim()
    .replace(/^O K$/g, 'OK')
