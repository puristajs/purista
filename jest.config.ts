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
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/database/', '/test/', '/lib/'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'text-summary'],
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/**/src/**/*.(ts|tsx)',
    '!**/testhelper/**/*.test.{ts}',
    '!**/*.test.{ts}',
    '!**/*.mock.{ts}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/website/**',
    '!**/test/**',
    '!**/_testdata/**',
    '!packages/cli/**',
  ],

  coverageThreshold: {
    global: {
      branches: 20,
      functions: 80,
      lines: 50,
      statements: 50,
    },
  },

  coverageProvider: 'v8',

  modulePathIgnorePatterns: ['.tshy-build', 'dist'],
  testTimeout: 60000,
}

export default jestConfig
