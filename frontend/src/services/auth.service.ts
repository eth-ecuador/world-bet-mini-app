import apiClient from './api-client';
import { useSession, signOut } from 'next-auth/react';

// Types for the API responses
interface LoginResponse {
  session_id: string;
  [key: string]: string | number | boolean | null; // For other potential fields with better typing
}

interface LogoutResponse {
  message: string;
}

/**
 * Safe localStorage access that works in both browser and SSR environments
 */
const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

/**
 * Auth service that handles login and logout operations with the external API
 */
export const authService = {
  /**
   * Login with Ethereum address
   * Creates a user account if it doesn't exist
   * @param ethAddress - The user's Ethereum wallet address
   * @returns The API response with session data
   */
  login: async (ethAddress: string): Promise<LoginResponse> => {
    if (!ethAddress) {
      throw new Error('Wallet address is required for login');
    }

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username: ethAddress
      });
      
      // Store the session token in localStorage
      if (response.data.session_id) {
        storage.set('authToken', response.data.session_id);
      } else {
        throw new Error('Invalid response: No session_id received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  /**
   * Logout the current user from the external API
   * Also removes the token from local storage
   */
  logout: async (): Promise<LogoutResponse> => {
    try {
      const token = storage.get('authToken');
      
      if (!token) {
        console.warn('No auth token found when trying to logout');
        return { message: "No active session to logout" };
      }
      
      // Explicitly set the Authorization header to ensure it's included
      const response = await apiClient.post<LogoutResponse>('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the token after successful logout
      storage.remove('authToken');
      
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      // Still remove the token even if the API call fails
      storage.remove('authToken');
      throw error;
    }
  },
  
  /**
   * Check if the user is currently authenticated with the external API
   * @returns True if the user has an auth token
   */
  isAuthenticated: (): boolean => {
    return !!storage.get('authToken');
  },
  
  /**
   * Get the current auth token
   * @returns The current auth token or null if not authenticated
   */
  getToken: (): string | null => {
    return storage.get('authToken');
  }
};

/**
 * Hook to use auth service with current session
 * Automatically gets the wallet address from the current session
 */
export const useAuthService = () => {
  const { data: session } = useSession();
  
  /**
   * Get the current user's wallet address from the session
   */
  const getCurrentWalletAddress = (): string | undefined => {
    return session?.user?.walletAddress;
  };
  
  /**
   * Check if the current user is logged in with NextAuth
   */
  const isSessionAuthenticated = (): boolean => {
    return !!session?.user;
  };
  
  /**
   * Login the current user with their wallet address from session
   * @throws Error if no wallet address is available
   */
  const loginCurrentUser = async (): Promise<LoginResponse> => {
    const walletAddress = getCurrentWalletAddress();
    
    if (!walletAddress) {
      throw new Error('No wallet address available in session');
    }
    
    return authService.login(walletAddress);
  };
  
  /**
   * Logout the current user from both the external API and NextAuth
   */
  const logoutCurrentUser = async (): Promise<void> => {
    // First logout from the external API if authenticated
    if (authService.isAuthenticated()) {
      await authService.logout();
    }
    
    // Then logout from NextAuth
    await signOut();
  };
  
  return {
    // Session status
    session,
    isSessionAuthenticated,
    
    // Current user methods
    getCurrentWalletAddress,
    loginCurrentUser,
    logoutCurrentUser,
    
    // External API status
    isExternalApiAuthenticated: authService.isAuthenticated,
    getExternalApiToken: authService.getToken,
    
    // Base service for direct access if needed
    authService
  };
}; 