const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/supabase-js.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(isomorphic-ws|@supabase|@supabase/supabase-js|@supabase/realtime-js)/)',
  ],
}

module.exports = createJestConfig(customJestConfig) 