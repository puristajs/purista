service.mountHarness(harness, { targets: { example: { publish: true } } })
service.mountHarness(harness, { targets: [{ name: 'example', policy: { publish: true } }] })
