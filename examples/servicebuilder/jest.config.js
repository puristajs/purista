/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/database/', '/test/', '/lib/'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    'src/**/*.impl.(ts|tsx)',
    '!**/testhelper/**/*.test.{ts}',
    '!**/*.test.{ts}',
    '!**/*.mock.{ts}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  /*
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 80,
      lines: 50,
      statements: 50,
    },
  },
  */
  coverageProvider: 'v8',
  projects: [
    {
      displayName: 'test',
      transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
      },
      testMatch: [
        '**/*.test.ts',
        '!**/testhelper/**/*.test.{ts}',
        '!**/*.test.{ts}',
        '!**/*.mock.{ts}',
        '!**/node_modules/**',
        '!**/dist/**',
      ],
      transformIgnorePatterns: ['/node_modules/(?!(nanoid)/)', '/bar/'],
    },
  ],
  testTimeout: 60000,
}