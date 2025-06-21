import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { loadPackageJson } from './loadPackageJson.js'

describe('loadPackageJson', () => {
  it('reads package.json', async () => {
    const dir = mkdtempSync('pkg-json')
    try {
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'x' }))
      const pkg = await loadPackageJson(dir)
      expect(pkg.name).toBe('x')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('throws if file missing', async () => {
    const dir = mkdtempSync('pkg-json')
    try {
      await expect(loadPackageJson(dir)).rejects.toThrow('Unable to proceed without package.json')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
