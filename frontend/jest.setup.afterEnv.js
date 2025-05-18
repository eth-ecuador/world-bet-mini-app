// This file will set up Jest's test framework after the test environment is created
// but before each test file is executed

// Make sure the jest object is available globally
import { jest } from '@jest/globals';
global.jest = jest;

// Make the mocking API available everywhere
global.jest.mock = jest.mock;
global.jest.fn = jest.fn;
global.jest.spyOn = jest.spyOn;

// Add other utilities that might be needed in tests
global.jest.mocked = jest.mocked;
global.jest.setTimeout = jest.setTimeout;
global.jest.useFakeTimers = jest.useFakeTimers;
global.jest.useRealTimers = jest.useRealTimers;

// Log setup confirmation
console.log('Jest globals configured for ESM modules'); 