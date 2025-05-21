import { TokenBalance, TokenBalanceResponse } from "./wallet.type";

/**
 * Fetches the token balance for a given address
 *
 * @param address The wallet address to check
 * @param token The token symbol (defaults to "USDC")
 * @returns A promise resolving to the token balance information
 */
export const getTokenBalance = async (
  address: string,
  token: string = "USDC"
): Promise<TokenBalanceResponse> => {
  try {
    // Input validation
    if (!address) {
      return { error: "Address is required" };
    }

    const response = await fetch(
      `/api/web3/get-balance?address=${encodeURIComponent(
        address
      )}&token=${encodeURIComponent(token)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        error: errorData.error || `Failed to fetch balance: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return data as TokenBalance;
  } catch (error) {
    console.error("Error in getTokenBalance service:", error);
    return { 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Checks if a response is an error
 * 
 * @param response The response to check
 * @returns True if the response is an error
 */
export const isTokenBalanceError = (
  response: TokenBalanceResponse
): response is { error: string } => {
  return "error" in response;
};

/**
 * Gets the formatted balance with token symbol
 * 
 * @param balance The token balance response
 * @returns Formatted balance string with token symbol (e.g., "10.50 USDC")
 */
export const getFormattedBalance = (balance: TokenBalance): string => {
  return `${balance.formattedBalance} ${balance.token}`;
}; 