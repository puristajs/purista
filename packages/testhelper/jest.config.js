/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
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
    },
  ],
}
