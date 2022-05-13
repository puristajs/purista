import { createReadStream } from 'fs'
import { lstat } from 'fs/promises'
import { contentType, lookup } from 'mime-types'
import { extname, join, normalize } from 'path'

import { HandledError, StatusCode } from '../../../core'
import { CompressionMethod, getCompressionMethod, getCompressionStream } from '../../../helper'
import { ContentType, Context, Middleware } from '../../types'

export type StaticFileHandlerOptions = {
  path: string
  removeStartingPath?: string
  gzipMimeTypes?: ContentType[]
}

/**
 * It returns a default configuration for the static file middleware.
 * @returns A middleware function that can be used in the http server.
 */
export const getDefaultStaticFileHandlerOptions = (): StaticFileHandlerOptions => {
  return {
    path: '../public',
    gzipMimeTypes: [
      'application/json',
      //  'application/javascript',
      'text/csv',
      // 'text/css',
      'text/html',
      'text/javascript',
      'text/markdown',
      'text/plain',
    ],
  }
}

export const createStaticFileHandler = (options = getDefaultStaticFileHandlerOptions()): Middleware => {
  const config = { ...getDefaultStaticFileHandlerOptions(), ...options }

  const StaticFileHandler: Middleware = async function (log, request, response, context) {
    if (request.method !== 'GET') {
      return context
    }

    const url = new URL(request.url, 'https://example.org/')
    let reqPath = url.pathname

    if (config.removeStartingPath) {
      reqPath = reqPath.replace(config.removeStartingPath, '')
    }

    let filePath = join(normalize(config.path), normalize(reqPath))

    let compressionMethod: CompressionMethod

    // get file info and try to use index.html on directory
    try {
      let info = await lstat(filePath)
      if (info.isDirectory()) {
        filePath = join(filePath, 'index.html')
      }
      info = await lstat(filePath)
      if (!info.isFile()) {
        return context
      }

      compressionMethod = getCompressionMethod(request.headers, info.size)
    } catch (err) {
      return context
    }

    return new Promise<Context>((resolve, reject) => {
      const mimeType = lookup(filePath)
      const responseContentType = contentType(extname(filePath))
      // deepcode ignore PT: <we know that this might be dangerous in general to serve static files>
      const readStream = createReadStream(filePath)

      readStream.on('open', () => {
        if (responseContentType) {
          response.setHeader('content-type', responseContentType)
        }

        const stream = getCompressionStream(compressionMethod)
        if (stream && mimeType && config.gzipMimeTypes?.includes(mimeType)) {
          response.setHeader('content-encoding', 'gzip')
          readStream.pipe(stream).pipe(response)
        } else {
          readStream.pipe(response)
        }
      })

      readStream.on('error', (err: Error & { code?: string }) => {
        if (err.code === 'ENOENT') {
          resolve(context)
        } else {
          log.error(err)
          reject(new HandledError(StatusCode.InternalServerError))
        }
      })

      readStream.on('end', () => {
        context.isResponseSend = true
        resolve(context)
      })
    })
  }

  return StaticFileHandler
}
