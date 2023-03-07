import { ServiceInfoValidator } from './ServiceInfoValidator.impl'

describe('ServiceInfoValidator', () => {
  it('throws on empty service name', () => {
    const info = new Proxy(
      {
        serviceName: '',
        serviceDescription: '',
        serviceVersion: '1',
      },
      ServiceInfoValidator,
    )
    expect(() => {
      info.serviceName = ''
    }).toThrowError('serviceName must be set')
  })

  it('throws on invalid service name', () => {
    const info = new Proxy(
      {
        serviceName: '',
        serviceDescription: '',
        serviceVersion: '1',
      },
      ServiceInfoValidator,
    )
    expect(() => {
      info.serviceName = '@some$service'
    }).toThrowError('serviceName "@some$service" is invalid. Only allowed to have a-z, A-Z, 0-9, -, _ as characters.')
  })

  it('throws on empty service version', () => {
    const info = new Proxy(
      {
        serviceName: '',
        serviceDescription: '',
        serviceVersion: '1',
      },
      ServiceInfoValidator,
    )
    expect(() => {
      info.serviceVersion = ''
    }).toThrowError('serviceVersion must be set')
  })

  it('throws on invalid service version', () => {
    const info = new Proxy(
      {
        serviceName: '',
        serviceDescription: '',
        serviceVersion: '1',
      },
      ServiceInfoValidator,
    )
    expect(() => {
      info.serviceVersion = 'x'
    }).toThrowError('serviceVersion "x" is invalid. Only allowed number characters 0-9.')
  })
})
