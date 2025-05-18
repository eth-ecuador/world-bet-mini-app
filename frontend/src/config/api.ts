import { API_MOCKS } from "./mocks";

// API configuration types
export interface ApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requireAuth?: boolean;
  hasMock?: boolean;
}

export interface ApiEndpoints {
  [key: string]: {
    [key: string]: ApiEndpoint;
  };
}

export interface ApiEnvironment {
  BASE_URL: string;
  USE_MOCKS: boolean;
}

export interface ApiConfig {
  ENV: ApiEnvironment; 
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
  HEADERS: Record<string, string>;
  ENDPOINTS: ApiEndpoints;
}

// Environment configurations
const API_ENVIRONMENTS: Record<string, ApiEnvironment> = {
  development: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "apiEndpointURL/api/v1",
    USE_MOCKS: process.env.NEXT_PUBLIC_API_USE_MOCKS === "true" || true
  },
  production: {
    BASE_URL: "https://api.worldbet.com/api/v1",
    USE_MOCKS: false
  }
};

// Get current environment
const currentEnvironment = process.env.NEXT_PUBLIC_API_ENVIRONMENT || "development";

// Core API configuration
export const API_CONFIG: ApiConfig = {
  ENV: API_ENVIRONMENTS[currentEnvironment as keyof typeof API_ENVIRONMENTS] || API_ENVIRONMENTS.development,
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3"),
  HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  
  // Endpoint definitions with metadata
  ENDPOINTS: {
    EVENTS: {
      FEATURED: {
        path: "/events/featured",
        method: "GET",
        requireAuth: false,
        hasMock: true
      },
      DETAIL: {
        path: "/events/:id",
        method: "GET",
        requireAuth: false,
        hasMock: true
      }
    },
    SPORTS: {
      LIST: {
        path: "/sports",
        method: "GET",
        requireAuth: false,
        hasMock: true
      }
    },
    COMPETITIONS: {
      LIST: {
        path: "/competitions",
        method: "GET",
        requireAuth: false,
        hasMock: true
      }
    },
    BETS: {
      CREATE: {
        path: "/bets",
        method: "POST",
        requireAuth: true,
        hasMock: true
      },
      LIST: {
        path: "/bets",
        method: "GET",
        requireAuth: true,
        hasMock: true
      },
      DETAIL: {
        path: "/bets/:id",
        method: "GET",
        requireAuth: true,
        hasMock: true
      }
    },
  }
};

// Helper to get endpoint path with parameter substitution
export const getEndpointPath = (
  category: string, 
  endpoint: string, 
  params?: Record<string, string>
): string => {
  const endpointConfig = API_CONFIG.ENDPOINTS[category]?.[endpoint];
  if (!endpointConfig) {
    throw new Error(`Endpoint ${category}.${endpoint} not found in API configuration`);
  }

  let path = endpointConfig.path;
  
  // Replace path parameters like :id with values from params
  if (params) {
    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key]);
    });
  }

  return path;
};

// Helper to get mock data for an endpoint
export const getMockResponse = (category: string, endpoint: string): any => {
  const endpointConfig = API_CONFIG.ENDPOINTS[category]?.[endpoint];
  
  if (!endpointConfig || !endpointConfig.hasMock) {
    throw new Error(`No mock data available for ${category}.${endpoint}`);
  }
  
  // Type-safe access to the mock data
  const categoryMocks = API_MOCKS[category as keyof typeof API_MOCKS];
  if (!categoryMocks) {
    throw new Error(`No mock category found for ${category}`);
  }
  
  // Use index assertion since we've verified the endpoint exists in the config
  return (categoryMocks as Record<string, any>)[endpoint];
}; 