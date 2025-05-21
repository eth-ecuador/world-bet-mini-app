import { hashNonce } from "@/auth/wallet/client-helpers";
import {
  MiniAppWalletAuthSuccessPayload,
  MiniKit,
  verifySiweMessage,
} from "@worldcoin/minikit-js";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    walletAddress: string;
    username: string;
    profilePictureUrl: string;
    externalApiToken?: string;
  }

  interface Session {
    user: {
      walletAddress: string;
      username: string;
      profilePictureUrl: string;
      externalApiToken?: string;
    } & DefaultSession["user"];
  }
}

// Function to authenticate with the external API
// This will run server-side, so we need a server-side API client
async function authenticateWithExternalApi(address: string) {
  try {
    // In a server component, we can't use localStorage
    // So we need to make a direct API call
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: address }),
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to authenticate with external API:",
        await response.text()
      );
      return null;
    }

    const data = await response.json();
    return data.session_id;
  } catch (error) {
    console.error("Error authenticating with external API:", error);
    return null;
  }
}

// Auth configuration for Wallet Auth based sessions
// For more information on each option (and a full list of options) go to
// https://authjs.dev/getting-started/authentication/credentials
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      name: "World App Wallet",
      credentials: {
        nonce: { label: "Nonce", type: "text" },
        signedNonce: { label: "Signed Nonce", type: "text" },
        finalPayloadJson: { label: "Final Payload", type: "text" },
      },
      // @ts-expect-error TODO
      authorize: async ({
        nonce,
        signedNonce,
        finalPayloadJson,
      }: {
        nonce: string;
        signedNonce: string;
        finalPayloadJson: string;
      }) => {
        const expectedSignedNonce = hashNonce({ nonce });

        if (signedNonce !== expectedSignedNonce) {
          console.log("Invalid signed nonce");
          return null;
        }

        const finalPayload: MiniAppWalletAuthSuccessPayload =
          JSON.parse(finalPayloadJson);
        const result = await verifySiweMessage(finalPayload, nonce);

        if (!result.isValid || !result.siweMessageData.address) {
          console.log("Invalid final payload");
          return null;
        }

        // Authenticate with the external API to get a token
        const externalApiToken = await authenticateWithExternalApi(
          finalPayload.address
        );

        // Optionally, fetch the user info from your own database
        const userInfo = await MiniKit.getUserInfo(finalPayload.address);

        return {
          id: finalPayload.address,
          ...userInfo,
          externalApiToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.walletAddress = user.walletAddress;
        token.username = user.username;
        token.profilePictureUrl = user.profilePictureUrl;
        token.externalApiToken = user.externalApiToken;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.walletAddress = token.walletAddress as string;
        session.user.username = token.username as string;
        session.user.profilePictureUrl = token.profilePictureUrl as string;
        session.user.externalApiToken = token.externalApiToken as
          | string
          | undefined;
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // When the user signs in, the token is already obtained in authorize
      console.log("User signed in:", user.id);
    },
  },
});
