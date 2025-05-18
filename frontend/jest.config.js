/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        // Allow import from mock files
        allowJs: true,
        // Make sure to preserve JSX
        jsx: 'react-jsx',
      },
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.afterEnv.js'],
  testTimeout: 10000,
  injectGlobals: true, // Ensure jest globals are available
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleDirectories: ['node_modules', 'src'],
  // Explicitly tell Jest to respect the __mocks__ directory
  resetMocks: false,
}; 