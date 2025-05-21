import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { signOutComplete } from "@/auth/sign-out";

/**
 * Custom authentication hook that integrates NextAuth with our external API
 * Automatically syncs the authentication state and provides methods for login/logout
 */
export function useAuthComplete() {
  const { data: session, status } = useSession();
  const [externalApiAuthenticated, setExternalApiAuthenticated] = useState(
    authService.isAuthenticated()
  );

  // Sync external API authentication with NextAuth session
  useEffect(() => {
    // If there's a session but we're not logged in to the external API
    if (session?.user?.walletAddress && !externalApiAuthenticated) {
      const loginToExternalApi = async () => {
        try {
          await authService.login(session.user.walletAddress);
          setExternalApiAuthenticated(true);
        } catch (error) {
          console.error("Failed to authenticate with external API:", error);
        }
      };

      loginToExternalApi(); 
    }
    // If there's no session but we're still logged in to the external API
    else if (!session && externalApiAuthenticated) {
      authService
        .logout()
        .then(() => setExternalApiAuthenticated(false))
        .catch((error) =>
          console.error("Error logging out from external API:", error)
        );
    }
  }, [session, externalApiAuthenticated]);

  return {
    // NextAuth session status
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",

    // External API status
    externalApiAuthenticated,

    // Utility methods
    logout: signOutComplete,

    // User info
    user: session?.user,
    walletAddress: session?.user?.walletAddress,
  };
}
