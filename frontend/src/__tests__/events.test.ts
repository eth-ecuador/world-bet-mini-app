import { eventsService } from '../services/events';
import { API_CONFIG } from '../config/api';
import { API_MOCKS } from '../lib/mocks';

describe('Events Service', () => {
  // Store original env
  const originalEnv = { ...API_CONFIG.ENV };
  
  beforeEach(() => {
    // Enable mocks for testing
    API_CONFIG.ENV.USE_MOCKS = true;
  });
  
  afterEach(() => {
    // Restore original config
    API_CONFIG.ENV = originalEnv;
  });

  test('should fetch featured events using mock data', async () => {
    // Call the service which will use the mock data
    const result = await eventsService.getFeaturedEvents();
    
    // Verify the result matches our mock data from mocks.ts
    expect(result).toEqual(API_MOCKS.EVENTS.FEATURED);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events[0].name).toBe('Barcelona vs Real Madrid');
    expect(result.total_count).toBe(42);
  });
  
  test('should include football events in the results', async () => {
    // Call the service
    const result = await eventsService.getFeaturedEvents();
    
    // At least one event should be football
    const footballEvents = result.events.filter(event => event.sport_type === 'football');
    expect(footballEvents.length).toBeGreaterThan(0);
    // Verify the data for a football event
    expect(footballEvents[0].competition).toContain('Liga');
  });

  test('should fetch event details by ID', async () => {
    // Call the service with event ID
    const eventId = 'evt-001';
    const result = await eventsService.getEventDetails(eventId);
    
    // Type assertion for the result
    const typedResult = result as typeof API_MOCKS.EVENTS.DETAIL;
    
    // Verify the result matches our mock data
    expect(typedResult).toEqual(API_MOCKS.EVENTS.DETAIL);
    expect(typedResult.id).toBe(eventId);
    expect(typedResult.name).toBe('Barcelona vs Real Madrid');
    
    // Check for detailed fields that should be in event details
    expect(typedResult).toHaveProperty('venue');
    expect(typedResult).toHaveProperty('markets');
    expect(typedResult).toHaveProperty('stats');
  });
}); 