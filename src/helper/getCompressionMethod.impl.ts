import { IncomingHttpHeaders } from 'http2'

import { CompressionMethod, MIN_CONTENT_SIZE_FOR_COMPRESSION } from './types'

/**
 * If the client accepts gzip, deflate, or br encoding, return the best one that's available
 * @param {IncomingHttpHeaders} input - IncomingHttpHeaders
 * @param {number} [size] - The size of the response body.
 * @returns A compression method.
 */
export const getCompressionMethod = (input: IncomingHttpHeaders, size?: number): CompressionMethod => {
  if (!input || (size && size < MIN_CONTENT_SIZE_FOR_COMPRESSION)) {
    return undefined
  }

  const headers = input['accept-encoding']

  if (!headers) {
    return undefined
  }

  const encodings: string[] = []
  if (Array.isArray(headers)) {
    headers.forEach((header) => header.split(',').forEach((entry) => encodings.push(entry)))
  } else {
    headers.split(',').forEach((entry) => encodings.push(entry.trim().toLowerCase()))
  }

  const compressions = {
    gzip: false,
    deflat: false,
    br: false,
  }

  encodings.forEach((encoding) => {
    if (encoding.startsWith('gzip')) {
      compressions.gzip = true
    }
    if (encoding.startsWith('deflat')) {
      compressions.deflat = true
    }
    if (encoding.startsWith('br')) {
      compressions.br = true
    }
  })

  return compressions.br ? 'br' : compressions.gzip ? 'gzip' : compressions.deflat ? 'deflat' : undefined
}
