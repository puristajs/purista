import { Server } from 'node:http'
import { Socket } from 'node:net'

/**
 * This helper will help to safely close a http server
 * @param server
 */
export const ensureHttpServerClose = function (server: Server) {
  const sockets = new Set<Socket>()

  function onSocketClose(this: Socket) {
    sockets.delete(this)
  }

  server.on('connection', function (socket) {
    sockets.add(socket)
    socket.on('close', onSocketClose)
  })

  const close = server.close

  server.close = function (callback?: ((err?: Error | undefined) => void) | undefined) {
    close.apply(this, [callback])

    sockets.forEach(function (socket: any) {
      const res = socket._httpMessage

      // Close all keep-alive sockets
      if (!res) {
        socket.destroy()
        return
      }

      // If headers is not sent, then say we don't want keep-alive
      if (!res.headersSent) {
        res.setHeader('Connection', 'close')
      }
    })

    sockets.clear()
    return server
  }
}
