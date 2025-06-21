import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { getFormatConfig } from './getFormatConfig.js'

describe('getFormatConfig', () => {
  it('returns default when no config file exists', async () => {
    const dir = mkdtempSync('purista-format')
    try {
      const result = await getFormatConfig(dir)
      expect(result.formatter).toBe('none')
      expect(result.codeWriterOptions.indentNumberOfSpaces).toBe(2)
      expect(result.codeWriterOptions.useTabs).toBe(true)
      expect(result.codeWriterOptions.useSingleQuote).toBe(true)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('reads biome configuration', async () => {
    const dir = mkdtempSync('purista-format')
    try {
      const config = {
        formatter: { indentWidth: 4, indentStyle: 'space', quoteStyle: 'double' },
        javascript: { formatter: { indentWidth: 3 } }
      }
      writeFileSync(join(dir, 'biome.json'), JSON.stringify(config))

      const result = await getFormatConfig(dir)
      expect(result.formatter).toBe('biome')
      expect(result.codeWriterOptions.indentNumberOfSpaces).toBe(3)
      expect(result.codeWriterOptions.useTabs).toBe(false)
      expect(result.codeWriterOptions.useSingleQuote).toBe(false)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
