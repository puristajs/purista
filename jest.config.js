/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts}',
    '!**/testhelper/**/*.test.{ts}',
    '!**/*.test.{ts}',
    '!**/*.mock.{ts}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageProvider: 'v8',
  projects: [
    {
      displayName: 'test',
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
      testMatch: [
        '**/*.{ts}',
        '!**/testhelper/**/*.test.{ts}',
        '!**/*.test.{ts}',
        '!**/*.mock.{ts}',
        '!**/node_modules/**',
        '!**/dist/**',
      ],
    },
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testMatch: ['<rootDir>/**/*.ts', '!<rootDir>/**/*.test.ts', '!**/bundle/**', '!**/dist/**'],
    },
  ],
}
