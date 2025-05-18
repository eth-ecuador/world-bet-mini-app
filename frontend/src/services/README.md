# Config-Driven API Architecture

This directory contains services for external API communication using axios, following a configuration-driven development approach.

## Structure

- `api.ts` - Base API client with common request functionality using axios
- `events.ts` - Events-specific API services

## Configuration

The API configuration is stored in `src/config/api.ts`. This follows a config-driven development approach where all endpoint definitions, methods, and mock responses are defined in a central place.

Key features of the config-driven approach:
- Centralized endpoint definitions
- Type-safe API calls
- Built-in mock system
- Path parameter substitution
- Consistent error handling

## Types

API types are defined in `src/types/api.ts`.

## Usage Example

```typescript
// Import the events service
import { eventsService } from '../services/events';

// Get featured events with optional filters
const featuredEvents = await eventsService.getFeaturedEvents({
  sport_type: 'football',
  date_from: '2023-05-01',
  date_to: '2023-05-31',
  limit: 20
});

// Get event details by ID
const eventDetails = await eventsService.getEventDetails("evt-123");

// Using the React hook
import { useFeaturedEvents } from '../hooks/useEvents';

function MyComponent() {
  const { 
    events, 
    loading, 
    error,
    params,
    updateFilters
  } = useFeaturedEvents({
    sport_type: 'football'
  });

  // Update filters
  const handleSportChange = (sportType) => {
    updateFilters({ sport_type: sportType });
  };

  if (loading && events.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
}
```

## Making Direct API Calls

You can use the `apiClient` directly for more complex scenarios:

```typescript
import { apiClient } from '../services/api';

// GET request
const events = await apiClient.get('EVENTS', 'FEATURED', { 
  sport_type: 'football' 
});

// POST request with data
const loginResult = await apiClient.post('AUTH', 'LOGIN', { 
  username: 'user', 
  password: 'pass' 
});

// Path parameters
const eventDetails = await apiClient.get('EVENTS', 'DETAIL', {}, {}, { 
  id: 'evt-123' 
});

// Custom headers
const protectedData = await apiClient.get('EVENTS', 'FEATURED', {}, {
  headers: { 'X-Custom-Header': 'value' }
});
```

## Mock System

The API client includes a built-in mock system. Enable it by setting:

```
NEXT_PUBLIC_API_USE_MOCKS=true
```

Mock responses are defined in the API configuration and automatically returned when mocks are enabled.

## Error Handling

The API client uses axios for HTTP requests and includes built-in error handling with the `ApiError` class. All API calls are wrapped with retry logic, timeout handling, and appropriate error responses.

## Available Endpoints

All endpoints are defined in the `API_CONFIG.ENDPOINTS` object in `src/config/api.ts`:

### Events API

- `EVENTS.FEATURED` - Get featured events with optional filters:
  - `sport_type`: Filter by sport type (string)
  - `date_from`: Filter by start date (YYYY-MM-DD)
  - `date_to`: Filter by end date (YYYY-MM-DD)
  - `limit`: Number of results to return (default: 10)

- `EVENTS.DETAIL` - Get event details by ID (requires path param `id`)

### Auth API

- `AUTH.LOGIN` - Login endpoint (POST)
- `AUTH.REFRESH` - Token refresh endpoint (POST, requires auth) 