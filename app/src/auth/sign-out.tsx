import { signOut as nextAuthSignOut } from "next-auth/react";
import { authService } from "@/services/auth.service";

/**
 * Sign out from both NextAuth and the external API
 * This ensures that the user is completely logged out from all systems
 *
 * @param options Optional NextAuth signOut options
 * @returns Promise that resolves when logout is complete
 */
export async function signOutComplete(
  options?: Parameters<typeof nextAuthSignOut>[0]
) {
  try {
    // First, attempt to logout from the external API
    // This needs to happen before NextAuth logout because we need the token
    if (typeof window !== "undefined") {
      try {
        await authService.logout();
      } catch (error) {
        console.error("Error during external API logout:", error);
        // Continue with NextAuth logout even if external API logout fails
      }
    }

    // Then logout from NextAuth
    return nextAuthSignOut(options);
  } catch (error) {
    console.error("Error during complete sign out:", error);
    throw error;
  }
}
