import { createBrotliCompress, createDeflate, createGzip } from 'zlib'

import { CompressionMethod } from './types'

/**
 * Given a compression method, return a stream that compresses data
 * @param {CompressionMethod} compressionMethod - The compression method to use.
 * @returns A function that accepts a stream and returns a stream.
 */
export const getCompressionStream = (compressionMethod: CompressionMethod) => {
  switch (compressionMethod) {
    case 'br':
      return createBrotliCompress()
    case 'gzip':
      return createGzip()
    case 'deflat':
      return createDeflate()
    default:
      return undefined
  }
}
