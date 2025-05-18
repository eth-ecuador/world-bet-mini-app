// Set environment variables for testing
process.env.NEXT_PUBLIC_API_BASE_URL = 'apiEndpointURL/api/v1';
process.env.NEXT_PUBLIC_API_USE_MOCKS = 'true';
process.env.NEXT_PUBLIC_API_ENVIRONMENT = 'development';

// Fixed date for consistent test results
const FIXED_DATE = new Date('2023-05-15T12:00:00Z');

// Store the original Date constructor
const OriginalDate = Date;

// Mock Date to return consistent timestamps in tests
global.Date = class extends OriginalDate {
  constructor(...args) {
    if (args.length === 0) {
      return FIXED_DATE;
    }
    return new OriginalDate(...args);
  }
};

// Make sure static methods work
global.Date.now = () => FIXED_DATE.getTime();
global.Date.parse = OriginalDate.parse;
global.Date.UTC = OriginalDate.UTC; 