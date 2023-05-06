import { getLoggerMock } from '../mocks'
import { HttpClient } from './HttpClient.impl'

describe('HttpClient', () => {
  it('can post', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({
      baseUrl: 'http://example.com',
      logger: logger.mock,
      defaultHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })

    client.setBearerToken('123')

    const payload = { some: 'data' }
    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('POST')

      const x = req?.headers as any
      expect(x['Authorization']).toBe('Bearer 123')
      expect(x['Content-Type']).toBe('application/json; charset=utf-8')

      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.post('/example', payload)).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('can patch', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

    const payload = { some: 'data' }
    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('PATCH')
      expect(req?.body).toBe(JSON.stringify(payload))
      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.patch('/example', payload)).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('can put', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

    const payload = { some: 'data' }
    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('PUT')
      expect(req?.body).toBe(JSON.stringify(payload))
      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.put('/example', payload)).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('can delete', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('DELETE')
      expect(req?.body).toBeUndefined()
      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.delete('/example')).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('can get', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('GET')
      expect(req?.body).toBeUndefined()
      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.get('/example')).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('can get json', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('GET')
      expect(req?.body).toBeUndefined()
      return Promise.resolve({
        headers: {
          get: () => 'application/json',
        },
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.get('/example')).resolves.toBe(response)
    } finally {
      fetchMock.mockRestore()
    }
  })

  it('throws', async () => {
    const logger = getLoggerMock()
    const client = new HttpClient({ baseUrl: 'http://example.com', logger: logger.mock })

    const response = { ok: 'ok' }

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url, req) => {
      expect(url).toStrictEqual(new URL('http://example.com/example'))
      expect(req?.method).toBe('GET')
      expect(req?.body).toBeUndefined()
      return Promise.resolve({
        status: 400,
        headers: {
          get: () => 'application/json',
        },
        ok: false,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as any)
    })

    try {
      await expect(client.get('/example')).rejects.toThrow('Bad Request')
    } finally {
      fetchMock.mockRestore()
    }
  })
})
