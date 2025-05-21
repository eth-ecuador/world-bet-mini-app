export interface TokenBalance {
  address: string;
  token: string;
  tokenAddress: string;
  balance: string;
  formattedBalance: string;
}

export interface TokenBalanceError {
  error: string;
}

export type TokenBalanceResponse = TokenBalance | TokenBalanceError; 