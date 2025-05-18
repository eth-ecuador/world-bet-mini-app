// API configuration types
export interface ApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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
    USE_MOCKS: process.env.NEXT_PUBLIC_API_USE_MOCKS === "true",
  },
  production: {
    BASE_URL: "https://api.worldbet.com/api/v1",
    USE_MOCKS: false,
  },
};

// Get current environment
const currentEnvironment =
  process.env.NEXT_PUBLIC_API_ENVIRONMENT || "development";

// Core API configuration
export const API_CONFIG: ApiConfig = {
  ENV:
    API_ENVIRONMENTS[currentEnvironment as keyof typeof API_ENVIRONMENTS] ||
    API_ENVIRONMENTS.development,
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3"),
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Endpoint definitions with metadata
  ENDPOINTS: {
    EVENTS: {
      FEATURED: {
        path: "/events/featured",
        method: "GET",
      },
    },
    BETS: {
      CREATE: {
        path: "/bets",
        method: "POST",
      },
      LIST: {
        path: "/bets",
        method: "GET",
      },
      DETAIL: {
        path: "/bets/:id",
        method: "GET",
      },
    },
  },
};
