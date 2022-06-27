import { getNewSubscriptionId } from './getNewSubscriptionId.impl'

it('returns a unique id', () => {
  const id1 = getNewSubscriptionId()
  expect(id1).toBeDefined()
  expect(id1).not.toBeNaN()
  expect(id1).not.toBeNull()
  expect(typeof id1).toBe('string')

  const id2 = getNewSubscriptionId()
  expect(id2).toBeDefined()
  expect(id2).not.toBeNaN()
  expect(id2).not.toBeNull()
  expect(typeof id2).toBe('string')

  expect(id1).not.toBe(id2)
})
