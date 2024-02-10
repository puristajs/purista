import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const loadPackageJson = (folder: string): Record<string, unknown> => {
  try {
    const content = readFileSync(join(folder, 'package.json'))
    return JSON.parse(content.toString('utf-8'))
  } catch (error) {
    throw new Error('Unable to proceed without package.json')
  }
}
