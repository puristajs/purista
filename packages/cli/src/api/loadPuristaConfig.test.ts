import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { loadPuristaConfig } from './loadPuristaConfig.js'

describe('loadPuristaConfig', () => {
  it('loads configuration file', async () => {
    const dir = mkdtempSync('purista-config')
    try {
      writeFileSync(join(dir, 'purista.json'), JSON.stringify({ fileConvention: 'kebab', eventConvention: 'kebab' }))
      const cfg = await loadPuristaConfig(dir)
      expect(cfg.fileConvention).toBe('kebab')
      expect(cfg.eventConvention).toBe('kebab')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('throws if not found', async () => {
    const dir = mkdtempSync('purista-config')
    try {
      await expect(loadPuristaConfig(dir)).rejects.toThrow('purista.json not found')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
