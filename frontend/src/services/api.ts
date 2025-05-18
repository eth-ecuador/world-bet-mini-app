import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG, getEndpointPath, getMockResponse } from "../config/api";

// Error class for API errors
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Interface for request options
interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  useAuth?: boolean;
  mockDelay?: number;
  skipMock?: boolean;
}

// Create axios instance with default config
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.ENV.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  });

  // Add request interceptor for auth tokens if needed
  instance.interceptors.request.use(
    async (config) => {
      // This is where you would add auth tokens if needed
      // if (config.headers && requiresAuth) {
      //   config.headers.Authorization = `Bearer ${await getAuthToken()}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const axiosInstance = createApiInstance();

// Mock API response handler
const handleMockResponse = <T>(category: string, endpoint: string, mockDelay = 500): Promise<T> => {
  const mockData = getMockResponse(category, endpoint);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData as T);
    }, mockDelay);
  });
};

// Base API client
export const apiClient = {
  /**
   * Make a request to the API
   */
  async request<T>(
    method: string, 
    category: string,
    endpoint: string, 
    options: RequestOptions = {}, 
    pathParams?: Record<string, string>,
    data?: any
  ): Promise<T> {
    const { params, headers = {}, timeout, useAuth = false, mockDelay = 500, skipMock = false } = options;
    
    const endpointConfig = API_CONFIG.ENDPOINTS[category]?.[endpoint];
    if (!endpointConfig) {
      throw new Error(`Endpoint ${category}.${endpoint} not found in API configuration`);
    }
    
    // Check if using mock data
    if (!skipMock && API_CONFIG.ENV.USE_MOCKS && endpointConfig.hasMock) {
      return handleMockResponse<T>(category, endpoint, mockDelay);
    }

    // Get the endpoint path with any path parameters
    const url = getEndpointPath(category, endpoint, pathParams);

    // Filter out undefined params
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : undefined;
    
    // Request config
    const config: AxiosRequestConfig = {
      params: filteredParams,
      headers: { ...API_CONFIG.HEADERS, ...headers },
    };
    
    if (timeout !== undefined) {
      config.timeout = timeout;
    }

    let retries = 0;
    
    while (retries < API_CONFIG.RETRY_ATTEMPTS) {
      try {
        let response: AxiosResponse<T>;
        
        switch (method.toUpperCase()) {
          case "GET":
            response = await axiosInstance.get<T>(url, config);
            break;
          case "POST":
            response = await axiosInstance.post<T>(url, data, config);
            break;
          case "PUT":
            response = await axiosInstance.put<T>(url, data, config);
            break;
          case "DELETE":
            response = await axiosInstance.delete<T>(url, config);
            break;
          case "PATCH":
            response = await axiosInstance.patch<T>(url, data, config);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        return response.data;
      } catch (error: any) {
        retries++;
        
        if (axios.isAxiosError(error)) {
          // If it's a server response error, don't retry, just throw
          if (error.response) {
            throw new ApiError(
              `API error: ${error.response.status} ${error.response.statusText}`,
              error.response.status,
              error.response.data
            );
          }
          
          // If we've reached max retries, throw error
          if (retries >= API_CONFIG.RETRY_ATTEMPTS) {
            throw new ApiError(
              error.message || "Network error",
              0, // Since we know there's no response in this case
              undefined // No response data available
            );
          }
        } else if (retries >= API_CONFIG.RETRY_ATTEMPTS) {
          // For non-axios errors, throw after max retries
          throw error instanceof Error
            ? error
            : new Error("Unknown error occurred");
        }
        
        // Exponential backoff: wait 2^retries * 100ms before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retries) * 100)
        );
      }
    }
    
    throw new ApiError("Maximum retry attempts reached", 0);
  },
  
  /**
   * GET request helper
   */
  async get<T>(
    category: string,
    endpoint: string,
    params?: Record<string, any>,
    options: Omit<RequestOptions, 'params'> = {},
    pathParams?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("GET", category, endpoint, { ...options, params }, pathParams);
  },

  /**
   * POST request helper
   */
  async post<T>(
    category: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
    pathParams?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("POST", category, endpoint, options, pathParams, data);
  },
  
  /**
   * PUT request helper
   */
  async put<T>(
    category: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
    pathParams?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("PUT", category, endpoint, options, pathParams, data);
  },
  
  /**
   * DELETE request helper
   */
  async delete<T>(
    category: string,
    endpoint: string,
    options: RequestOptions = {},
    pathParams?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("DELETE", category, endpoint, options, pathParams);
  },
  
  /**
   * PATCH request helper
   */
  async patch<T>(
    category: string,
    endpoint: string,
    data?: any,
    options: RequestOptions = {},
    pathParams?: Record<string, string>
  ): Promise<T> {
    return this.request<T>("PATCH", category, endpoint, options, pathParams, data);
  },
  
  /**
   * Use this to disable mocks for a specific request
   */
  withRealApi() {
    return {
      get: <T>(category: string, endpoint: string, params?: Record<string, any>, options: Omit<RequestOptions, 'params'> = {}, pathParams?: Record<string, string>) =>
        this.get<T>(category, endpoint, params, { ...options, skipMock: true }, pathParams),
      
      post: <T>(category: string, endpoint: string, data?: any, options: RequestOptions = {}, pathParams?: Record<string, string>) =>
        this.post<T>(category, endpoint, data, { ...options, skipMock: true }, pathParams),
      
      put: <T>(category: string, endpoint: string, data?: any, options: RequestOptions = {}, pathParams?: Record<string, string>) =>
        this.put<T>(category, endpoint, data, { ...options, skipMock: true }, pathParams),
      
      delete: <T>(category: string, endpoint: string, options: RequestOptions = {}, pathParams?: Record<string, string>) =>
        this.delete<T>(category, endpoint, { ...options, skipMock: true }, pathParams),
      
      patch: <T>(category: string, endpoint: string, data?: any, options: RequestOptions = {}, pathParams?: Record<string, string>) =>
        this.patch<T>(category, endpoint, data, { ...options, skipMock: true }, pathParams)
    };
  }
};
