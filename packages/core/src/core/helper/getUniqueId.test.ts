import { getUniqueId } from './getUniqueId.impl.js'

it('returns a unique id', () => {
  const id1 = getUniqueId()
  expect(id1).toBeDefined()
  expect(id1).not.toBeNaN()
  expect(id1).not.toBeNull()
  expect(typeof id1).toBe('string')

  const id2 = getUniqueId()
  expect(id2).toBeDefined()
  expect(id2).not.toBeNaN()
  expect(id2).not.toBeNull()
  expect(typeof id2).toBe('string')

  expect(id1).not.toBe(id2)
})
