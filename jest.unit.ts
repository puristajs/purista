import * as dotenv from 'dotenv'
import type { JestConfigWithTsJest } from 'ts-jest'

dotenv.config({
  path: '.env.test',
})

const jestConfig: JestConfigWithTsJest = {
  // [...]
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  coverageProvider: 'v8',
  modulePathIgnorePatterns: ['.tshy-build', 'dist', '/test/'],
  testTimeout: 60000,
}

export default jestConfig
