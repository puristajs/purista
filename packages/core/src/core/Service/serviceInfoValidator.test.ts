import { ServiceInfoValidator } from './ServiceInfoValidator.impl.js'

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
    }).toThrow('serviceName must be set')
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
    }).toThrow('serviceName "@some$service" is invalid. Only allowed to have a-z, A-Z, 0-9, -, _ as characters.')
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
    }).toThrow('serviceVersion must be set')
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
    }).toThrow('serviceVersion "x" is invalid. Only allowed number characters 0-9.')
  })
})
